/**
 * Created by Hamid Ali on 2/12/2016.
 */


app
    .factory('dateTimeService', function () {

        return{

            madeTime: function (dateTime) {
                if (dateTime == '') {
                    var newDate = new Date();
                } else {
                    var newDate = dateTime;
                }
                if (newDate == "Invalid Date") {
                    return dateformat;
                } else {
                    var date = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
                    var mon = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
                    var year = newDate.getFullYear();
                    var madeDate = mon + '-' + date + '-' + year;
                    var hours = newDate.getHours();
                    var minutes = newDate.getMinutes();
                    var seconds = newDate.getSeconds();
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    minutes = minutes < 10 ? '0' + minutes : minutes;
                    seconds = seconds < 10 ? '0' + seconds : seconds;
                    var madeTime = hours + ':' + minutes + '' + ampm;
                    var made = madeDate + ' ' + madeTime;
                    return made;
                }
            }

        }


    })

