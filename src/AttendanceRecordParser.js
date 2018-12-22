/**
* 依存ライブラリ
* https://script.google.com/d/1Mc8BthYthXx6CoIz90-JiSzSafVnT6U3t0z_W3hLTAX5ek4w0G_EIrNw/edit?usp=drive_web
*/
(function(global){
  var AttendanceRecordParser = (function() {
    
    /*
     * JOBCAN モバイルページ出勤簿ページパーサー
     */
    function AttendanceRecordParser()
    {
    };
    
    /*
     * JOBCAN 出勤簿ページをパースする
     * @param {string} htmlテキスト
     * @return {array} 出勤簿ページの勤怠テーブルの2次元配列
     */
    AttendanceRecordParser.prototype.parse = function(text) {
      // 対象の年月
      var parser = Parser.data(text);
      var year_mon = parser.from('<th>').to('</th>').build();
      var matches = year_mon.match(/(\d+)年(\d+)月/);
      var year = Number(matches[1]);
      var month =  Number(matches[2]) - 1;
    
      var scraped  = parser.from('<b>総計</b> ').to('&nbsp;').build();

      var records = [];
      while(true) {
        var eol = false;
        var day  = parser.from('<td nowrap align="right">').to('<font style="font-size: xx-small">').build().trim();
        if (0 > parser.end || parser.end >= parser.last) {
          // Logger.log("test: " + parser.end + ", last: " + parser.last + ', day: ' + day);
          eol = true;
        }
        // Logger.log(day);
        var status = parser.offset(parser.end).from('<td style="color: red;" nowrap>').to('</td>').build().trim();
        // Logger.log(status);
        var start_time  = parser.offset(parser.end).from('<a href="javascript:void(0)">').to('</a>').build().trim();
        start_time = this.toDate(year, month, day, start_time);
        // Logger.log(start_time);
        var end_time  =  parser.offset(parser.end).from('<a href="javascript:void(0)">').to('</a>').build().trim();
        end_time = this.toDate(year, month, day, end_time);
        // Logger.log(end_time);
        var rest_time = parser.offset(parser.end).from('<a href="javascript:void(0)">').to('</a>').build().trim();
        rest_time = this.toElapsedMinutes(rest_time);
        // Logger.log(rest_time);
        var work_time = parser.offset(parser.end).from('<a href="javascript:void(0)">').to('</a>').build().trim();
        work_time = this.toElapsedMinutes(work_time);
        // Logger.log(work_time);
        
        records.push([
          new Date(year, month, day),
          status,
          start_time,
          end_time,
          rest_time,
          work_time,
        ]);
        
        if (eol) {
          break;
        }
        // Logger.log('-------------------------------------------------------------');
      }

      return records;
    };

    //////////////////////////////
    // private 
    //////////////////////////////
    
    AttendanceRecordParser.prototype.toDate = function(year, month, day, str) {
      var matches = str.match(/(\d+):(\d+)/);
      if (null === matches) {
        return null;
      }
      var hour = Number(matches[1]);
      var min = Number(matches[2]);
      var date = new Date(year, month, day, hour, min, 0);
      return date;
    };
    
    AttendanceRecordParser.prototype.toElapsedMinutes = function(str) {
      var matches = str.match(/(\d+).*?時間.*?(\d+).*?分/);
      if (null === matches) {
        return null;
      }
      var hour = Number(matches[1]);
      var min = Number(matches[2]);
      var elapsed_minutes = Number(hour * 60 + min);
      return elapsed_minutes;
    };
    
    return AttendanceRecordParser;
  })();
  
  global.AttendanceRecordParser = AttendanceRecordParser;
  
})(this);