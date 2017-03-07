//座位不留空验证
validSeatAlone(){
  let seatRows = $('.seats .seatsContainer .row');
  //逐行进行判断
  $.each(seatRows,(rowi,rowval)=>{
    /*type : 1:普通座  2:情侣座  3:vip座,4:柜台专售,5保留座位 6:过道*/
    /*status -1不可售,0可售,1已售,3锁定*/
    //先取出不可售状态的座位
    let seatCols = $(rowval).children('span');
    let seatSolded = [],  //定义不可售状态的座位数组
        seatSoldedOther = [], //定义别人已经买好的座位
        seatSelected = [];  //定义自己新买好的座位
    $.each(seatCols,(coli,colval)=>{
      let $colval = $(colval);
      if($colval.data('seat').status != 0){
        // seatSolded.push($(colval).data('seat').column)
        seatSoldedOther.push({
          className: $colval.attr('class'),
          status: $colval.data('seat').status,
          column: Number($colval.data('seat').column)
        });
      }
      if($colval.hasClass('selected')){
        seatSelected.push({
          className: $colval.attr('class'),
          status: $colval.data('seat').status,
          column: Number($colval.data('seat').column)
        });
      }
    })

    seatSolded = seatSoldedOther.concat(seatSelected).sort((a,b)=>{
      return a.column - b.column;
    });
    if(seatSolded.length <= 1){
      seats.validSeatAloneResult = true;
    }else {
      //处理边角问题
      let seatSoldedOtherL = seatSoldedOther.length;
      if(seatSoldedOtherL > 0){
        //第一情况，左边侧，但不在右边侧
        if(seatSoldedOther[0].column <= 3 && seatSoldedOther[seatSoldedOtherL - 1].column < seats.col_count - 2){
          let tempSeatSelectedArray = [];
          $.each(seatSolded,(tempi,tempval)=>{
            if(tempval.column >= 3){
              tempSeatSelectedArray.push(tempval);
            }
          })
          //座位不留空算法
          seats.leaveBlank(tempSeatSelectedArray);
        // 第二情况，右边侧，但不在左边侧
        }else if(seatSoldedOther[0].column > 3 && seatSoldedOther[seatSoldedOtherL - 1].column >= seats.col_count - 2) {
          let tempSeatSelectedArray = [];
          $.each(seatSolded,(tempi,tempval)=>{
            if(tempval.column <= (seats.col_count - 2)){
              tempSeatSelectedArray.push(tempval);
            }
          })
          //座位不留空算法
          seats.leaveBlank(tempSeatSelectedArray);
        // 第三情况，同时左边侧和右边侧
        }else if(seatSoldedOther[0].column <= 3 && seatSoldedOther[seatSoldedOtherL - 1].column >= seats.col_count - 2){
          sests.validSeatAloneResult = true;
          //第四情况，同时不在左边侧和右边侧
        }else if(seatSoldedOther[0].column > 3 && seatSoldedOther[seatSoldedOtherL - 1].column >= seats.col_count - 2){
          //座位不留空算法
          seats.leaveBlank(seatSolded);
        }
        //处理通用情况
      }else {
        //座位不留空算法
        seats.leaveBlank(seatSolded);
      }
    }
    //退出seatRows循环
    if(!seats.validSeatAloneResult){
      return false;
    }
  })
  return this.validSeatAloneResult;
},
//座位不留空算法
leaveBlank(seatSolded){
  $.each(seatSolded,(soldedi,soldedval)=>{
      //处理通用情况
      try{
        //本座位列数
        let selfCol = Number(soldedval.column),
        //下一个座位列数
            nextCol = soldedi == (seatSolded.length - 1) ? Number(seatSolded[soldedi - 1].column) :  Number(seatSolded[soldedi + 1].column),
            //比较结束
            colResult = Math.abs(nextCol - selfCol);
            if(colResult == 2){
              seats.validSeatAloneResult = false;
              return false;
            }
      }catch(e){

      }
    // }
  })
}
