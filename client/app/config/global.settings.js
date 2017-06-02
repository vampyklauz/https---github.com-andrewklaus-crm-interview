'use strict';

app.factory('GlobalFunctions',function() {
    return {
        getCurrentDate: function() {
            var d = new Date();
            var curr_date  = d.getDate();
            var curr_month = d.getMonth()+1;
            var curr_year  = d.getFullYear();
            var curr_hour  = d.getHours();
            var curr_min   = d.getMinutes();
            var curr_sec   = d.getSeconds();
            if (curr_hour<10) curr_hour = "0"+curr_hour;
            if (curr_min <10) curr_min  = "0"+curr_min;
            if (curr_sec <10) curr_sec  = "0"+curr_sec;
            return (curr_month + "/" + curr_date + "/" + curr_year + " " + curr_hour + ":" + curr_min + ":" + curr_sec);
        }
    }
});

app.value('ContactStatuses', [
    {
        "code": "active",
        "name": "Active"
    }, {
        "code": "inactive",
        "name": "Inactive"
    }, {
        "code": "doNotContact",
        "name": "Do not contact"
    }]
);

app.value('CompanyStatuses', [
    {
        "code": "unverified",
        "name": "Unverified"
    }, {
        "code": "verified",
        "name": "Verified"
    }, {
        "code": "blacklisted",
        "name": "Blacklisted"
    }, {
        "code": "approved",
        "name": "Approved"
    }]
);

app.value('AllStates', [
{
    stateCode: "AL",
    stateName: "Alabama"
}, {
    stateCode: "AK",
    stateName: "Alaska"
}, {
    stateCode: "AZ",
    stateName: "Arizona"
}, {
    stateCode: "AR",
    stateName: "Arkansas"
}, {
    stateCode: "CA",
    stateName: "California"
}, {
    stateCode: "CO",
    stateName: "Colorado"
}, {
    stateCode: "CT",
    stateName: "Connecticut"
}, {
    stateCode: "DE",
    stateName: "Delaware"
}, {
    stateCode: "DC",
    stateName: "District of Columbia"
}, {
    stateCode: "FL",
    stateName: "Florida"
}, {
    stateCode: "GA",
    stateName: "Georgia"
}, {
    stateCode: "HI",
    stateName: "Hawaii"
}, {
    stateCode: "ID",
    stateName: "Idaho"
}, {
    stateCode: "IL",
    stateName: "Illinois"
}, {
    stateCode: "IN",
    stateName: "Indiana"
}, {
    stateCode: "IA",
    stateName: "Iowa"
}, {
    stateCode: "KS",
    stateName: "Kansas"
}, {
    stateCode: "KY",
    stateName: "Kentucky"
}, {
    stateCode: "LA",
    stateName: "Lousiana"
}, {
    stateCode: "ME",
    stateName: "Maine"
}, {
    stateCode: "MD",
    stateName: "Maryland"
}, {
    stateCode: "MA",
    stateName: "Massachusetts"
}, {
    stateCode: "MI",
    stateName: "Michigan"
}, {
    stateCode: "MN",
    stateName: "Minnesota"
}, {
    stateCode: "MS",
    stateName: "Mississippi"
}, {
    stateCode: "MO",
    stateName: "Missouri"
}, {
    stateCode: "MT",
    stateName: "Montana"
}, {
    stateCode: "NE",
    stateName: "Nebraska"
}, {
    stateCode: "NV",
    stateName: "Nevada"
}, {
    stateCode: "NH",
    stateName: "New Hampshire"
}, {
    stateCode: "NJ",
    stateName: "New Jersey"
}, {
    stateCode: "NM",
    stateName: "New Mexico"
}, {
    stateCode: "NY",
    stateName: "New York"
}, {
    stateCode: "NC",
    stateName: "North Carolina"
}, {
    stateCode: "ND",
    stateName: "North Dakota"
}, {
    stateCode: "OH",
    stateName: "Ohio"
}, {
    stateCode: "OK",
    stateName: "Oklahoma"
}, {
    stateCode: "OR",
    stateName: "Oregon"
}, {
    stateCode: "PA",
    stateName: "Pennsylvania"
}, {
    stateCode: "RI",
    stateName: "Rhode Island"
}, {
    stateCode: "SC",
    stateName: "South Carolina"
}, {
    stateCode: "SD",
    stateName: "South Dakota"
}, {
    stateCode: "TN",
    stateName: "Tennessee"
}, {
    stateCode: "TX",
    stateName: "Texas"
}, {
    stateCode: "UT",
    stateName: "Utah"
}, {
    stateCode: "VT",
    stateName: "Vermont"
}, {
    stateCode: "VA",
    stateName: "Virginia"
}, {
    stateCode: "WA",
    stateName: "Washington"
}, {
    stateCode: "WV",
    stateName: "West Virginia"
}, {
    stateCode: "WI",
    stateName: "Wisconsin"
}, {
    stateCode: "WY",
    stateName: "Wyoming"
}, {
    stateCode: "WDC",
    stateName: "Washington D.C."
}, {
    stateCode: "PR",
    stateName: "Puerto Rico"
}]);

