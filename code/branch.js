

//form欄位異動時會更新地圖
$("#lat").on("input", updateMap);
$("#lng").on("input", updateMap);

//filter欄位輸入時會觸發resetBranchTable
$('#filterBranchCode').on('input', resetBranchTable);
$('#filterBranchName').on('input', resetBranchTable);
$('#filterBranchType').on('input', resetBranchTable);
//filterBranchStatus 異動時會觸發resetBranchTable
$('#filterBranchStatus').on('switchChange.bootstrapSwitch', function(event, state) {
    resetBranchTable();
});

//點擊清除條件時會觸發resetBranchTable
$('#clearFilter').click(function() {
    $('#filterBranchCode').val('');
    $('#filterBranchName').val('');
    $('#filterBranchType').val('');
    $('#filterBranchStatus').val('');
    $('#filterBranchStatus').prop('checked', true).bootstrapSwitch('state', true);;

    resetBranchTable();
});

function clearBranchModal() {
    $('#branchId').val('');
    $('#branchCode').val('');
    $('#branchName').val('');
    $('#branchPhone').val('');
    $('#branchAddress').val('');
    $('#zipCode').val('');
    $('#lat').val('');
    $('#lng').val('');
    $('#branchStatus').prop('checked', true).bootstrapSwitch('state', true);;
    $('input[name="branchType"]').prop('checked', false);
}

function openBranchModal() {
    clearBranchModal();
    $('#branchModal').modal('show');
}

function editBranchModal(id) { 
    clearBranchModal();

    //取得localstorage的資料並filter id
    var existingData = localStorage.getItem('branchData');
    var parsedData = existingData ? JSON.parse(existingData) : [];
    var branchData = parsedData.find(function(branch) {
        return branch.id == id;
    });

    //將資料填入modal
    $("#branchId").val(branchData.id);
    $('#branchCode').val(branchData.branchCode);
    $('#branchName').val(branchData.branchName);
    $('#branchPhone').val(branchData.branchPhone);
    $('#branchAddress').val(branchData.branchAddress);
    $('#zipCode').val(branchData.zipCode);
    $('#lat').val(branchData.lat);
    $('#lng').val(branchData.lng);
    $('#branchStatus').prop('checked', branchData.branchStatus).bootstrapSwitch('state', branchData.branchStatus);;
    $('input[name="branchType"][value="' + branchData.branchType + '"]').prop('checked', true);

    $('#branchModal').modal('show');
}   

function getFormVal() {
    //取得modal的值
    var branchData= {
        id: $('#branchId').val(), 
        branchCode: $('#branchCode').val(),
        branchName: $('#branchName').val(),
        branchStatus: $('#branchStatus').is(':checked'),
        branchType: $('input[name="branchType"]:checked').val(),
        branchPhone: $('#branchPhone').val(),
        branchAddress: $('#branchAddress').val(),
        zipCode: $('#zipCode').val(),
        lat: $('#lat').val(),
        lng: $('#lng').val(),
        updateTime: new Date().toLocaleString()
    };
    console.log(branchData);
    return branchData;
}

function saveBranch() {
    let branchId = $('#branchId').val();
    let formVal = getFormVal();

    var existingData = localStorage.getItem('branchData');
    var parsedData = existingData ? JSON.parse(existingData) : [];

    if (branchId) {
        var branchData = parsedData.find(function(branch) {
            return branch.id == branchId;
        });

        if (branchData) {
            branchData.branchCode = formVal.branchCode;
            branchData.branchName = formVal.branchName;
            branchData.branchPhone = formVal.branchPhone;
            branchData.branchAddress = formVal.branchAddress;
            branchData.zipCode = formVal.zipCode;
            branchData.lat = formVal.lat;
            branchData.lng = formVal.lng;
            branchData.branchStatus = formVal.branchStatus;
            branchData.branchType = formVal.branchType;
            branchData.updateTime = formVal.updateTime;
        }
  }else {
        formVal.id = new Date().getTime();
        parsedData.push(formVal);
    }
    localStorage.setItem('branchData', JSON.stringify(parsedData));

    resetBranchTable();
    $('#branchModal').modal('hide');
}

//reset the DataTable
function resetBranchTable() {
    //取得filter的值
    var branchCode = $('#filterBranchCode').val();
    var branchName = $('#filterBranchName').val();
    var branchType = $('#filterBranchType').val();
    var branchStatus = $('#filterBranchStatus').is(':checked');

    var existingData = localStorage.getItem('branchData');
    var parsedData = existingData ? JSON.parse(existingData) : [];
    
    var filteredData = parsedData.filter(function(branch) {
        return (branchName == "" || branch.branchName.includes(branchName)) && 
               (branchCode == "" || branch.branchCode === branchCode) &&
               (branchType == "" || branch.branchType === branchType) &&
               branch.branchStatus === branchStatus;
    });
    
    var formattedData = filteredData.map(function(branch) {
        return [
            branch.branchCode,
            branch.branchName,
            branch.branchPhone,
            branch.branchAddress,
            branch.branchType,
            branch.updateTime,
            branch.branchStatus ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>',
            // 操作欄位
            '<button class="btn btn-success btn-sm" onclick="editBranchModal(' + branch.id + ')"><i class="fas fa-edit"></i></button>'
        ];  });

    // Reset the DataTable
    $('#branchTable').DataTable().clear().destroy();
    $('#branchTable').DataTable({
        "order": [[5, "desc"]], // Sort by update time
        "data": formattedData,
        "searching": false // Disable search box
    });
}


//google map
let map;
let marker;

function initMap() {
    const initialPosition = { lat: 25.0330, lng: 121.5654 }; // 預設位置（台北101）
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: initialPosition,
    });
    marker = new google.maps.Marker({
        position: initialPosition,
        map: map,
    });
}

function updateMap() {
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const position = { lat: lat, lng: lng };
    map.setCenter(position);
    marker.setPosition(position);
}


//一進入頁面會去localstorage將資料撈回來並render table
$(document).ready(function() {
    initMap();
    resetBranchTable();
    // 初始化 Bootstrap Switch
    $(".bootstrap-switch").bootstrapSwitch();
});