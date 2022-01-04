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

// 전화번호부 렌더링
var renderList = function(array){
    var listWrapper = document.getElementsByClassName('phoneListWrap');
    var phoenList = [];

    var deleteChecked = false;

    // 검색으로 list 그릴 경우
    if(array && array.length > 0){
        phoenList = array;
        // 기존에 있던 리스트 지우기
        while(listWrapper[0].hasChildNodes()){
            listWrapper[0].removeChild(listWrapper[0].firstChild);
        }

        // 검색 결과가 없는 경우
        if(array[0].comment){
            var emptySearchDiv = document.createElement('div');
            emptySearchDiv.className = 'emptySearch';
            var comment = document.createElement('p');
            comment.textContent = array[0].comment;

            emptySearchDiv.append(comment);
            listWrapper[0].append(emptySearchDiv);
            return;
        }

    }else{
        // 기존에 있던 리스트 지우기
        while(listWrapper[0].hasChildNodes()){
            listWrapper[0].removeChild(listWrapper[0].firstChild);
        }
        phoenList = getLocalStorage();
    }

    // 전화번호부가 있을 경우
    if(phoenList.length > 0){

        // 체크박스 전체 선택
        var allDelete = document.createElement('input');
        allDelete.setAttribute('type', 'checkbox');
        allDelete.setAttribute("style","display:none; margin-right:20px; margin-left:20px");
        allDelete.className = 'allDeleteCheck';
        allDelete.addEventListener('click', function(){
            var checkboxList = document.getElementsByClassName('deleteCheck');

            for(var i=0; i < checkboxList.length; i++){
                checkboxList[i].checked = this.checked;
            }
        })

        // 다중삭제 버튼
        var multiDeleteBtn = document.createElement('button');
        multiDeleteBtn.setAttribute("style","display:none; margin-right:20px; margin-left:20px");
        multiDeleteBtn.className = 'allDelete'
        multiDeleteBtn.textContent = '삭제';
        multiDeleteBtn.addEventListener('click', function(){
            var checkboxList = document.getElementsByClassName('deleteCheck');

            var checkedList = [];
            for(var i = 0; i < checkboxList.length; i++){
                if(checkboxList[i].checked){
                    checkedList.push(checkboxList[i].value);
                }
            }

            var is_delete = confirm(`${checkedList.length} 개의 전화번호를 지우시겠습니까?`);

            if(is_delete){
                var phoneBookList = getLocalStorage();

                // 전체 삭제일 경우
                if(phoneBookList.length == checkedList.length){
                    localStorage.removeItem('phoneBook');
                    location.reload();
                }

                var newPhoneBookList = [];
                // 다중 삭제일 경우
                for(var i = 0; i < phoneBookList.length; i++){
                    if(!checkedList.includes(String(phoneBookList[i].idx))){
                        newPhoneBookList.push(phoneBookList[i]);
                    }
                }

                localStorage['phoneBook'] = JSON.stringify(newPhoneBookList);
                location.reload();
            }
        });
        
        //다중삭제 toggle 버튼
        var toggleMultiDeleteBtn = document.createElement('button');
        toggleMultiDeleteBtn.textContent = '다중삭제 ON';
        toggleMultiDeleteBtn.addEventListener('click', function(){
            // 다중삭제 on & off
            if(!deleteChecked){
                deleteChecked = toggleDeleteCheckbox('inline', deleteChecked);
                toggleMultiDeleteBtn.textContent = '다중삭제 OFF';
            }else {
                deleteChecked = toggleDeleteCheckbox('none', deleteChecked);
                toggleMultiDeleteBtn.textContent = '다중삭제 ON';
            }
            
        });

        listWrapper[0].append(allDelete);
        listWrapper[0].append(multiDeleteBtn);
        listWrapper[0].append(toggleMultiDeleteBtn);

        phoenList.forEach((data, idx) => {
            // 전화번호부 커버
            var newPhoneCard = document.createElement('div');
            newPhoneCard.className = "phoneList";

            var checkBox = document.createElement('input');
            checkBox.setAttribute('type','checkbox');
            checkBox.setAttribute("style","display:none;");
            checkBox.className = 'deleteCheck';
            checkBox.value = data.idx;

            // 이름 커버
            var newNameDiv = document.createElement('div');
            newNameDiv.className = "name"+idx;

            // 이름 텍스트
            var nameText = document.createElement('p');
            nameText.textContent =  "이름 : " + data.name;

            newNameDiv.append(nameText);

            // 번호 커버
            var numberDiv = document.createElement('div');
            numberDiv.className = "number"+idx;

            // 번호 텍스트
            var numberText = document.createElement('p');
            numberText.textContent = "번호 : " + data.number;

            numberDiv.append(numberText);

            var idxDiv = document.createElement('div');
            idxDiv.className = data.idx;
            idxDiv.setAttribute('type','hiddend');
            idxDiv.style.width = '0px';

            // 삭제 버튼
            var deleteBtn = document.createElement('input');
            deleteBtn.setAttribute('type','button');
            deleteBtn.className = "delete "+idx;
            deleteBtn.value = '삭제'
            deleteBtn.addEventListener('click', function(){
                var idx = this.previousElementSibling.className;
                var confirm = window.confirm("삭제 하시겠습니까?");
                if(!confirm){
                    return;
                }
                deleteNumber(idx);
            });

            // 수정 버튼
            var updateBtn = document.createElement('input');
            updateBtn.setAttribute('type','button');
            updateBtn.className = "update "+idx;
            updateBtn.value = '수정'
            updateBtn.addEventListener('click', function(){
                var idx = this.previousElementSibling.previousElementSibling.className;
                updateNumber(idx);
            });

            newPhoneCard.append(checkBox);
            newPhoneCard.append(newNameDiv);
            newPhoneCard.append(numberDiv);
            newPhoneCard.append(idxDiv);
            newPhoneCard.append(deleteBtn);
            newPhoneCard.append(updateBtn);

            listWrapper[0].append(newPhoneCard)
        })


    }else{
        var commentDiv = document.createElement('div');
        commentDiv.className = 'emptyList';
        var comment = document.createElement('p');
        comment.textContent = '저장된 전화번호가 없습니다! 신규 등록해주세요.';

        commentDiv.append(comment);
        listWrapper[0].append(commentDiv);
    }
}

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

// 수정 
var updateNumber = function(idx){
    // 전화번호 1개 커버 div
    var parentNode = document.getElementsByClassName(idx)[0].parentNode;
    // 기존 이름
    var name = parentNode.children[1].textContent.slice(5);
    // 기존 전화번호
    var number = parentNode.children[2].textContent.slice(5);
    // localstorage idx
    var idx = parentNode.children[3].className;

    // 커버 div 안에 자식 노드들 지우기
    while(parentNode.hasChildNodes()){
        parentNode.removeChild(parentNode.firstChild);
    }

    updateDiv(parentNode, name, number, idx);
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

// update 위젯 -> ver2에서는 기존 div에서 p태그대신 input 넣기
var updateDiv = function(parentNode, name, number, idx){
    // 부모 위젯 클래스 이름 변경
    parentNode.className = 'updatePhoneList'

    // 이름 커버
    var newNameDiv = document.createElement('div');

    // 이름 label
    var nameLabel = document.createElement('label');
    nameLabel.textContent = '이름 : ';

    // 이름 input
    var nameInput = document.createElement('input');
    nameInput.className = 'updateWiget input';
    nameInput.setAttribute('type','text');
    nameInput.value = name;
    
    newNameDiv.append(nameLabel);
    newNameDiv.append(nameInput);

    // 번호 커버
    var numberDiv = document.createElement('div');
    numberDiv.className = 'updateWiget div';

    // 번호 label
    var numberLabel = document.createElement('label');
    numberLabel.textContent = '번호 : ';

    // 번호 input
    var numberInput = document.createElement('input');
    numberInput.className = 'updateWiget input';
    numberInput.setAttribute('type','number');
    numberInput.value = number;

    numberDiv.append(numberLabel);
    numberDiv.append(numberInput);

    // 수전 버튼 커버
    var updateBtnDiv = document.createElement('div');
    updateBtnDiv.className = 'updateWiget btn update'
    
    // 수정 버튼 
    var updateBtn = document.createElement('input');
    updateBtn.setAttribute('type','button');
    updateBtn.value = '완료';
    updateBtn.addEventListener('click',function(){
        // 좋지 않은 방법이므로 element에 직접 접근하는 함수 따로 만들기
        var changeName = document.getElementsByClassName('updateWiget input')[0].value;
        var changeNumber = document.getElementsByClassName('updateWiget input')[1].value;

        var cheched = checkInputData({name:changeName, number: changeNumber});

        if(cheched == 1){
            var phonBookList = getLocalStorage();
            phonBookList.forEach((data) => {
                if(data.idx == idx){
                    data.name = changeName;
                    data.number = changeNumber;
                }
                localStorage['phoneBook'] = JSON.stringify(phonBookList);
            });
            document.location.reload(true);
        }

        return ;        
    });

    updateBtnDiv.append(updateBtn);

    // 취소 버튼 커버
    var cancleBtnDiv = document.createElement('div');
    cancleBtnDiv.className = 'updateWiget btn cancle'
    
    // 취소 버튼 
    var cancleBtn = document.createElement('input');
    cancleBtn.setAttribute('type','button');
    cancleBtn.value = '취소';
    cancleBtn.addEventListener('click',function(){
        document.location.reload();
    })

    cancleBtnDiv.append(cancleBtn);


    parentNode.append(newNameDiv);
    parentNode.append(numberDiv);
    parentNode.append(updateBtnDiv);
    parentNode.append(cancleBtnDiv);
}

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

// 삭제 체크박스 hide or view
var toggleDeleteCheckbox = function(display, state){
    document.getElementsByClassName('allDeleteCheck')[0].style.display = display;
    document.getElementsByClassName('allDelete')[0].style.display = display;

    var checkboxList = document.getElementsByClassName('deleteCheck');

    for(var i = 0; i < checkboxList.length; i++){
        checkboxList[i].style.display = display;
    }

    return !state;
}

renderList([]);


