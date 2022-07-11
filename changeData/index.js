// Done +++
function handleChangeCity(ele1, ele2) {
    let districts = getAllDistrict();
    let results = [];
    let value = $(ele1).find(":selected").val();
    $(ele2).empty();
    districts.data.map((district, index) => {
        if (district['Parent_Value'] === value) {
            results.push(district);
        }
    });
    results.map((item, index) => {
        $(ele2).append(new Option(item['UI_Show'], item['Value']));
    });
}

// Done +++
function handleChangeWard(ele1, ele2) {
    let wards = getAllWard();
    let results = [];
    let value = $(ele1).find(":selected").val();
    $(ele2).empty();
    wards.data.map((ward, index) => {
        if (ward['Parent_Value'] === value) {
            results.push(ward);
        }
    });
    results.map((item, index) => {
        $(ele2).append(new Option(item['UI_Show'], item['Value']));
    });
}