YUI.add("lang/inputex_en", function(Y) {

    Y.Intl.add(

    "inputex",
    // associated module
    "en",
    // BCP 47 language tag
    {
        // inputex
        required: "This field is required",
        invalid: "This field is invalid",
        valid: "This field is valid",
        defaultDateFormat: "m/d/Y",
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        timeUnits: {
            SECOND: "seconds",
            MINUTE: "minutes",
            HOUR: "hours",
            DAY: "days",
            MONTH: "months",
            YEAR: "years"
        },
        stringTooShort: ["This field should contain at least ", " numbers or characters"],
        stringTooLong: ["This field should contain at most ", " numbers or characters"],

        ajaxWait: "Please wait...",

        // date
        selectMonth: "- Select Month -",
        dayTypeInvite: "Day",
        monthTypeInvite: "Month",
        yearTypeInvite: "Year",
        invalidDate: "Invalid date, ex: 03/27/2008",

        // email
        invalidEmail: "Invalid email, ex: sample@test.com",
        didYouMean: "Did you mean: ",
        disposableEmail: "Disposable email address not allowed with domain: ",
        
        // inplaceedit
        emptyInPlaceEdit: "(click to edit)",
        cancelEditor: "cancel",
        okEditor: "Ok",

        // ipv4
        invalidIPv4: "Invalid IPv4 address, ex: 192.168.0.1",

        // menu
        menuTypeInvite: "Click here to select",

        // password
        invalidPassword: ["The password schould contain at least ", " numbers or characters"],
        invalidPasswordConfirmation: "Passwords are different !",
        capslockWarning: "Warning: CapsLock is on",
        passwordStrength: "Password Strength",

        // url
        invalidUrl: "Invalid URL, ex: http://www.test.com",

        // string-availability
        stringLoading: "Checking if available ...",
        stringAvailable: "This ressource is available",
        stringUnAvailable: "This ressource is not available",


        // ratingstars
        ratingMsg: "Rating: % (% votes cast) ",
        // we choose a % convention to replace by values
        thanksRate: "Thanks for voting!",
        sendingRate: "Sending your rate ...",

        // color
        selectColor: "Select a color :",

        // list
        listAddLink: "Add",
        listRemoveLink: "remove",

        // datatable
        saveText: "Save",
        cancelText: "Cancel",
        deleteText: "delete",
        modifyText: "modify",
        insertItemText: "Insert",
        addButtonText: "Add",
        loadingText: "Loading...",
        emptyDataText: "No records found.",
        errorDataText: "Data error.",
        confirmDeletion: "Are you sure?",
        tableOptions: "Table options",
        showColumnButton: "Show",
        hideColumnButton: "Hide",
        columnDialogTitle: "Choose which columns you would like to see",
        columnDialogCloseButton: "Close"

    });

    Y.inputEx.messages = Y.Intl.get("inputex");
},
'3.0.0a', {
    requires: ['inputex']
});
