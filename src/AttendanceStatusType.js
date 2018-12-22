(function(global){
  var AttendanceStatusType = (function() {
    
    /**
     * 勤怠ステータスのEnum
     *
     * @param {string} name ステータスKey
     * @param {string} ja_title 和名（表示用途）
     */
    function AttendanceStatusType(name, ja_title)
    {
      this.name = name;
      this.ja_title = ja_title;
    };
    
    /**
     * 勤怠ステータスのkey名
     *
     * @return {string} 
     */
    AttendanceStatusType.prototype.getName = function() {
      return this.name;
    };
    
    /**
     * 勤怠ステータスの表示用文字列を取得する
     *
     * @return {string} 
     */
    AttendanceStatusType.prototype.getJaTitle = function() {
      return this.ja_title;
    };
    
    /**
     * 勤怠ステータスのkey名から勤怠ステータスオブジェクトを取得する
     *
     * @param {string} value ステータスKey
     * @return {AttendanceStatusType} 
     */
    AttendanceStatusType.valueOf = function(value) {
      for (var i = 0; i < AttendanceStatusType.TYPES.length; i++) {
        if (value === AttendanceStatusType.TYPES[i].name) {
          return AttendanceStatusType.TYPES[i];
        }
      }

      throw new Error('未定義の値: ' + value);
    };

    AttendanceStatusType.toString = function() {
      return 'AttendanceStatusType';
    };
    
    AttendanceStatusType.LATE = new AttendanceStatusType('遅', '遅刻');
    AttendanceStatusType.LEAVE_EARLY = new AttendanceStatusType('早', '早退');
    AttendanceStatusType.ABSENCE = new AttendanceStatusType('欠', '欠勤');
    AttendanceStatusType.NO_HOLIDAY = new AttendanceStatusType('有', '有休');
    AttendanceStatusType.SUBSTITUTE_HOLIDAY = new AttendanceStatusType('代', '代休');
    AttendanceStatusType.PAUSE = new AttendanceStatusType('振', '振休');
    AttendanceStatusType.SPECIAL_HOLIDAY = new AttendanceStatusType('特', '特休');
    
    AttendanceStatusType.TYPES = [
      AttendanceStatusType.LATE,
      AttendanceStatusType.LEAVE_EARLY,
      AttendanceStatusType.ABSENCE,
      AttendanceStatusType.NO_HOLIDAY,
      AttendanceStatusType.SUBSTITUTE_HOLIDAY,
      AttendanceStatusType.PAUSE,
      AttendanceStatusType.SPECIAL_HOLIDAY,
    ];
    
    return AttendanceStatusType;
  })();
  
  global.AttendanceStatusType = AttendanceStatusType;
  
})(this);