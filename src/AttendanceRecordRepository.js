(function(global){
  var AttendanceRecordRepository = (function() {
  
    var JOBCAN_ATTENDANCE_URL = 'https://ssl.jobcan.jp/m/work/conditions';
    
    /*
     * 勤怠リポジトリ
     * @param {Object} config 
     */
    function AttendanceRecordRepository(config)
    {
      this.login_url = config.login_url;
      this.cookies = [];
      
      // ログイン
      this._login();
    };
    
    /*
     * 対象年月の勤怠オブジェクトを取得する
     * @param {int} year 
     * @param {int} month 
     * @return {AttendanceRecord[]}
     */
    AttendanceRecordRepository.prototype.find = function(year, month) {
      var record_text = this._getAttendanceRecordContent(year, month);
      // スクレイピングして勤怠オブジェクトを構築する
      var parser = new AttendanceRecordParser();
      var records = parser.parse(record_text);
      var result_list = [];
      for (var i = 0; i < records.length; i++) {
        result_list.push(new AttendanceRecord(
          records[i][0],
          records[i][1] ? AttendanceStatusType.valueOf(records[i][1]) : null,
          records[i][2],
          records[i][3],
          records[i][4],
          records[i][5]
        ));
      }
      return result_list;
    };
    
    //////////////////////////////
    // private 
    //////////////////////////////
    
    /*
     * JOBCANにログインする
     */
    AttendanceRecordRepository.prototype._login = function() {
      var options = {
        'method': 'get',
        'headers': {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        }
      };
      var response = UrlFetchApp.fetch(this.login_url, options);
      
      if (response.getResponseCode() != 200) {
        // API 失敗
        throw new Error('ログインに失敗しました');
      }
      
      // リクエストに成功していたらクッキー保存
      var headers = response.getAllHeaders();
      var cookies = [];
      this.cookies = {};
      if ( typeof headers['Set-Cookie'] !== 'undefined' ) {
        // Set-Cookieヘッダーが2つ以上の場合はheaders['Set-Cookie']の中身は配列
        var cookies = typeof headers['Set-Cookie'] == 'string' ? [ headers['Set-Cookie'] ] : headers['Set-Cookie'];
        for (var i = 0; i < cookies.length; i++) {
          // Set-Cookieヘッダーからname=valueだけ取り出し、セミコロン以降の属性は除外する
          var cookies_item = cookies[i].split(';')[0];
          var key_value = cookies_item.split('=');
          this.cookies[key_value[0]] = key_value[1];
        };
      }
    };
    
    /*
     * 出勤簿ページのHTMLコンテンツを取得する
     */
    AttendanceRecordRepository.prototype._getAttendanceRecordContent = function(year, month) {
      return this.httpGet(JOBCAN_ATTENDANCE_URL + '?year=' + year + '&month=' + month);
    };
    
    AttendanceRecordRepository.prototype._sendRequest = function(url, method, params)
    {
      // Cookie文字列を生成
      var cookie_string = '';
      for (var key in this.cookies) {
        if (cookie_string.length > 0) {
          cookie_string += '; ';
        }
        cookie_string += key + '=' + this.cookies[key];
      }
      var options = {
        'method': method,
        'headers': {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Cookie' : cookie_string,
        },
        'payload': params,
      };
      result = UrlFetchApp.fetch(url, options);
      
      // リクエストに成功していたらコンテンツを返す
      if (result.getResponseCode() == 200) {
        return result.getContentText();
      }
      
      return false;
    };
    
    AttendanceRecordRepository.prototype.httpGet = function(url, params) { 
      params = params || {};
      
      // get_dataがあればクエリーを生成する
      // かなり簡易的なので必要に応じて拡張する
      var query_string_list = [];
      for (var key in params) {
        query_string_list.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
      }
      
      if (query_string_list.length > 0) {
        path += '?' + query_string_list.join('&'); 
      }
      
      return this._sendRequest(url, 'get');
    };
    
    
    return AttendanceRecordRepository;
  })();
  
  global.AttendanceRecordRepository = AttendanceRecordRepository;
  
})(this);