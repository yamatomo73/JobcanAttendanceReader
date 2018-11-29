(function(global){
  var AttendanceRecord = (function() {
    
    /**
     * 勤怠値オブジェクト
     *
     * @param {Date} date 勤務日付
     * @param {AttendanceStatusType|null} status 勤怠ステータス
     * @param {Date|null} start_date 勤務開始時間
     * @param {Date|null} start_date 勤務開始時間
     * @param {Date|null} end_date 勤務終了時間
     * @param {int|null} rest_min 休憩時間（分）
     * @param {int|null} work_min 労働時間 （分）
     */
    function AttendanceRecord(date, status, start_time, end_time, rest_min, work_min)
    {
      this.date = date;
      this.status = status;
      this.start_time = start_time;
      this.end_time = end_time;
      this.rest_min = rest_min;
      this.work_min = work_min;
    };
    
    AttendanceRecord.prototype.toArray = function() {
      return [this.date, this.status, this.start_time, this.end_time, this.rest_min, this.work_min];
    };

    AttendanceRecord.prototype.getDate = function() {
      return this.date;
    };
    
    AttendanceRecord.prototype.getStatus = function() {
      return this.status;
    };
    
    AttendanceRecord.prototype.getStartTime = function() {
      return this.start_time;
    };
    
    AttendanceRecord.prototype.getEndTime = function() {
      return this.end_time;
    };
    
    AttendanceRecord.prototype.getRestMinutes = function() {
      return this.rest_min;
    };
    
    AttendanceRecord.prototype.getWorkMinutes = function() {
      return this.work_min;
    };
    
    AttendanceRecord.toString = function() {
      return 'AttendanceRecord';
    };
    
    //////////////////////////////
    // private 
    //////////////////////////////
    
    return AttendanceRecord;
  })();
  
  global.AttendanceRecord = AttendanceRecord;
  
})(this);