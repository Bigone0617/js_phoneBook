/**  전화번호부 저장 및 검색 관련 코드 */

// 저장 total
var save = function(name, number){
    var nameInput = document.getElementById(name);
    var phoneInput = document.getElementById(number);

    
    var saveData = {
        name : nameInput.value,
        number : phoneInput.value
    }

    var checked = checkInputData({name: saveData.name, number: saveData.number});

    if(checked == 0){
        return;
    }

    saveLocalStorage(saveData)
}

// 검색
var search = function(){
    var phoneList = getLocalStorage();
    var searchWord = event.target.value;
    
    var searchDatas;

    // 검색 단어가 있는 경우
    if(searchWord){
        searchDatas = phoneList.filter((data) => {
            if(data.name.indexOf(searchWord) > -1){
                return data;
            }else if(data.number.indexOf(searchWord) > -1){
                return data;
            }
        })
    }else{
        // 검색창이 비었을 경우
        searchDatas = phoneList;
    }

    // 검색 결과가 없을 경우
    if(searchDatas.length < 1){
        searchDatas.push({comment : '검색 결과가 없습니다.'});
    }

    renderList(searchDatas);
    
}

