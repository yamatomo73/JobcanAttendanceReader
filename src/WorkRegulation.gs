(function(global){
  var WorkRegulation = (function() {
    
    /**
     * 勤務規定オブジェクト
     *
     * @param {int} prescribed_working_minutes 所定労働時間（分）
     * @param {int} recess_minutes 休憩時間（分）
     */
    function WorkRegulation(prescribed_working_minutes, recess_minutes)
    {
      // 所定労働時間（分）
      this.prescribed_working_minutes = prescribed_working_minutes;
      // 休憩時間（分）
      this.recess_minutes = recess_minutes;
    };
    
    /*
     * 対象の勤務パターンでの労働時間（分）を取得する
     * @param {AttendanceRecord}
     * @return {int} 
     */
    WorkRegulation.prototype.workingMinutes = function(attendance_record) {
      // TODO 勤務パターン(休出、半休、早退、遅刻等)に対応する
      if (attendance_record.getStartTime()) {
        return this.prescribed_working_minutes;
      }
      return 0;
    }
    
    /*
     * 対象の勤務パターンでの休憩時間（分）を取得する
     * @param {AttendanceRecord}
     * @return {int} 
     */
    WorkRegulation.prototype.recessMinutes = function(attendance_record) {
      // TODO 勤務パターン(半休、早退、遅刻等)に対応する
      if (attendance_record.getStartTime()) {
        return this.recess_minutes;
      }
      return 0;
    }
    
    /*
     * 定時の日時を取得する
     * @param {AttendanceRecord}
     * @return {Date} 
     */
    WorkRegulation.prototype.workOnTime = function(attendance_record) {
      if (null === attendance_record.getStartTime()) {
        return null;
      }
      // 開始から所定労働時間＋休憩経過後の日時が定時となる
      return new Date(attendance_record.getStartTime().getTime() 
        + this.workingMinutes(attendance_record) * 60 * 1000 
        + this.recessMinutes(attendance_record) * 60 * 1000);
    }
    
    /*
     * 定時までの残り時間（分）
     * @param {AttendanceRecord}
     * @return {int} 
     */
    WorkRegulation.prototype.remainingWorkTime = function(attendance_record) {
      var on_time = this.workOnTime(attendance_record);
      if (null === on_time) {
        return 0;
      }
      var now = new Date().getTime();
      if (now > on_time.getTime()) {
        return 0;
      }
      return Math.floor((on_time.getTime() - now) / 1000 / 60);
    }
    
    /*
     * 残業時間（分）
     * @param {AttendanceRecord}
     * @return {int} 
     */
    WorkRegulation.prototype.overTime = function(attendance_record) {
      var on_time = this.workOnTime(attendance_record);
      if (null === on_time) {
        return 0;
      }
      var diff_time = null;
      if (attendance_record.getEndTime()) {
        diff_time = attendance_record.getEndTime().getTime();
      } else {
        diff_time = new Date().getTime();
      }
      if (diff_time < on_time.getTime()) {
        return 0;
      }
      return Math.floor((diff_time - on_time.getTime()) / 1000 / 60);
    }
    
    WorkRegulation.prototype.getPrescribedWorkingMinutes = function() {
      return this.prescribed_working_minutes;
    };
    
    WorkRegulation.prototype.getRecessMinutes = function() {
      return this.recess_minutes;
    };
    
    WorkRegulation.toString = function() {
      return 'WorkRegulation';
    };
    
    //////////////////////////////
    // private 
    //////////////////////////////
    
    return WorkRegulation;
  })();
  
  global.WorkRegulation = WorkRegulation;
  
})(this);