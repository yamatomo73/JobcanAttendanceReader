(function(global){
  var AttendanceRecords = (function() {
    
    /**
     * 勤怠コレクション値オブジェクト
     * @param {WorkRegulation} work_regulation 勤務規定オブジェクト
     * @param {AttendanceRecord[]} records 
     */
    function AttendanceRecords(work_regulation, records)
    {
      this.work_regulation = work_regulation;
      this.records = records;
    };
    
    /*
     * 勤務日数
     * @return {int} 
     */
    AttendanceRecords.prototype.workingDayCount = function() {
      var count = 0;
      for (var i = 0; i < this.records.length; i++) {
        // 退勤記録があれば稼働日とする
        if (this.records[i].getEndTime()) {
          ++count;
        }
      }
      return count;
    }

    /*
     * 総残業時間（分）
     * 所定労働時間からの超過分を「残業時間」とする
     * @return {int} 
     */
    AttendanceRecords.prototype.overTime = function() {
      var prescribed_working_min = 0; 
      var sum_min = 0;
      for (var i = 0; i < this.records.length; i++) {
        sum_min += this.records[i].getWorkMinutes();
        prescribed_working_min += this.work_regulation.workingMinutes(this.records[i]);
      }
      return sum_min - prescribed_working_min;
    }
    
    return AttendanceRecords;
  })();
  
  global.AttendanceRecords = AttendanceRecords; 
})(this);

