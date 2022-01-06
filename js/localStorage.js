/** localStorage 관련 코드 */

// 로컬스토리지에서 전화번호부 가져오기
var getLocalStorage = function(){
    var phoneBook = localStorage.getItem('phoneBook');

    if(!phoneBook){
        localStorage.phoneBook = JSON.stringify([]);
        phoneBook = [];
    }else{
        phoneBook = JSON.parse(phoneBook);
    }

    return phoneBook
}


// 로컬스토리지에 새로운 데이터 저장
var saveLocalStorage = function(data){
    phonBookList = getLocalStorage();

    // 처음 저장일 경우
    if(phonBookList.length == 0){
        data.idx = 0
    }else{
        
        data.idx = phonBookList[phonBookList.length-1].idx + 1;
    }

    phonBookList.push(data);
    
    localStorage['phoneBook'] = JSON.stringify(phonBookList);
}

// 전화번호부 삭제
var deleteNumber = function(idx){
    var phonBookList = getLocalStorage();
    phonBookList = phonBookList.filter(data => {
        if(data.idx != idx){
            return data
        }
    });

    localStorage['phoneBook'] = JSON.stringify(phonBookList);
    // 페이지 리로드
    location.reload();
}