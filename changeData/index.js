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
    $(ele2).append(new Option("", ""));
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
    $(ele2).append(new Option("", ""));
    results.map((item, index) => {
        $(ele2).append(new Option(item['UI_Show'], item['Value']));
    });
}

// Done +++
function findCity(search) {
    let cities = getAllCity();
    let data = cities.data;
    let result = data.find(city => city.UI_Show.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    return result;
}

// Done +++
function findDistrict(search) {
    let districts = getAllDistrict();
    let data = districts.data;
    let result = data.find(district => district.UI_Show.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    return result;
}

// Done +++
function findWard(search) {
    let wards = getAllWard();
    let data = wards.data;
    let result = data.find(ward => ward.UI_Show.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    return result;
}

// Done +++
function findDistrictById(idParent) {
    try {
        let district = getDetailDistrict(idParent);
        return district;
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

// Done +++
function findWardById(idParent) {
    try {
        let ward = getDetailWard(idParent);
        return ward;
    }
    catch (error) {
        return {
            errorCode: error.status || 500,
            errorMessage: error.message
        }
    }
}

// Done +++
function handleGetDataAddress(searchCity, searchDistrict, searchWard) {
    let cityName = '';
    let cityValue = '';
    let districtName = '';
    let districtValue = '';
    let wardName = '';
    let wardValue = '';
    let resultCity = findCity(searchCity);
    if (resultCity) {
        let { Value, UI_Show } = resultCity;
        cityValue = Value;
        cityName = UI_Show;
        let district = findDistrictById(cityValue);
        let resultDistrict = findDistrict(searchDistrict);
        if (district && resultDistrict) {
            let { Value, UI_Show } = resultDistrict;
            districtValue = Value;
            districtName = UI_Show;
            let ward = findWardById(districtValue);
            let resultWard = findWard(searchWard);
            if (ward && resultWard) {
                let { Value, UI_Show } = resultWard;
                wardValue = Value;
                wardName = UI_Show;
            }
        }
    }
    return {
        city: { name: cityName, value: cityValue },
        district: { name: districtName, value: districtValue },
        ward: { name: wardName, value: wardValue },
    }
}