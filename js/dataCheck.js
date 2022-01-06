// 저장 & 수정 시 input 데이터 체크
var checkInputData = function(datas){
    // 이름이 비었을 경우
    if(!datas.name){
        alert('이름이 비었습니다. 확인해주세요 :)');
        return 0;
    }
    
    if(!datas.number){
        alert('전화번호가 비었거나 숫자가 아닌 글자가 포함되어 있습니다. 확인해주세요 :)');
        return 0;
    }

    return 1;
}