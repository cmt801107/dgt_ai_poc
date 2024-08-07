

function openBranchModal() {
    $('#branchModal').modal('show');
}

function saveBranch() {
    //參考modal的id取得input的值    
    var branchCode = $('#branchCode').val();
    var branchName = $('#branchName').val();
    var branchAddress = $('#branchAddress').val();
    var branchPhone = $('#branchPhone').val();
    var branchStatus = $('#branchStatus').val();
    
    //將取得的值組成物件
    var branchData = {
        branchCode: branchCode,
        branchName: branchName,
        branchAddress: branchAddress,
        branchPhone: branchPhone,
        branchStatus: branchStatus,
        updateTime: new Date().toLocaleString()
    };

    var existingData = localStorage.getItem('branchData');
    var parsedData = existingData ? JSON.parse(existingData) : [];
    parsedData.push(branchData);
    localStorage.setItem('branchData', JSON.stringify(parsedData));
    console.log(parsedData);

    resetBranchTable();
    $('#branchModal').modal('hide');
}

//reset the DataTable
function resetBranchTable() {
    //取得filter的值
    var branchCode = $('#filterBranchCode').val();
    var branchName = $('#filterBranchName').val();
    var branchType = $('#filterBranchType').val();
    // var branchStatus = $('#filterBranchStatus').val();
    
    var existingData = localStorage.getItem('branchData');
    var parsedData = existingData ? JSON.parse(existingData) : [];
    
    var filteredData = parsedData.filter(function(branch) {
        return (branchName == "" || branch.branchName.includes(branchName)) && 
               (branchCode == "" || branch.branchCode === branchCode);
    });
    
    var formattedData = filteredData.map(function(branch) {
        return [
            branch.branchCode,
            branch.branchName,
            branch.branchPhone,
            branch.branchAddress,
            "國內分行",
            branch.updateTime        
        ];
    });

    $('#branchTable').DataTable().clear().destroy(); // Reset the DataTable
    $('#branchTable').DataTable({
        "order": [[5, "desc"]], // Sort by update time
        "data": formattedData
    });
}


//一進入頁面會去localstorage將資料撈回來並render table
$(document).ready(function() {
    resetBranchTable();
    // 初始化 Bootstrap Switch
    $("[name='filterBranchStatus']").bootstrapSwitch();
});

//filter欄位輸入時會觸發resetBranchTable
$('#filterBranchCode').on('input', resetBranchTable);
$('#filterBranchName').on('input', resetBranchTable);
$('#filterBranchType').on('input', resetBranchTable);
// $('#filterBranchStatus').on('input', resetBranchTable);

//點擊清除條件時會觸發resetBranchTable
$('#clearFilter').click(function() {
    $('#filterBranchCode').val('');
    $('#filterBranchName').val('');
    $('#filterBranchType').val('');
    // $('#filterBranchStatus').val('');
    resetBranchTable();
});
