var unpublishedVariantsHidden = true;
var unpublishedVariantsClass1 = "li.umb-tree-item.not-published-add";
var unpublishedVariantsClass2 = "li.umb-tree-item.not-published";
var unpublishedVariantsRootClass = "a.umb-tree-root-link";
var unpublishedVariantsLabel = " (Unpublished Variants Hidden)";

$(document).ready(function () {
    var enableHideNodes = "";
    var hideNodesDefault = "";

    $.ajax({
        url: "/umbraco/api/TreeVariantSettings/HideUnpublishedVariantsEnable",
        success: function (data) {
            enableHideNodes = data;
        }
        , async: false
    });

    $.ajax({
        url: "/umbraco/api/TreeVariantSettings/HideUnpublishedVariantsDefault",
        success: function (data) {
            hideNodesDefault = data;
        }
        , async: false
    });

    if (enableHideNodes === "true" && hideNodesDefault === "hide") {
        hideVariantNodesByClass(unpublishedVariantsClass1);
        hideVariantNodesByClass(unpublishedVariantsClass2);
        EnableHideIndicatorFirstLoad();
        unpublishedVariantsHidden = true;
    }
});

function EnableHideIndicator() {
    var r = $(unpublishedVariantsRootClass);
    r.text(r.text() + unpublishedVariantsLabel);
}

function DisableHideIndicator() {
    var r = $(unpublishedVariantsRootClass);
    r.text(r.text().replace(unpublishedVariantsLabel, ""));
}

function EnableHideIndicatorFirstLoad() {
    $(document).arrive(unpublishedVariantsRootClass, function () {
        $(this).on("DOMSubtreeModified", function () {
            if ($(this).text().trim() != '') {
                $(this).off("DOMSubtreeModified");
                $(this).text($(this).text() + unpublishedVariantsLabel);
                $(document).unbindArrive(unpublishedVariantsRootClass);
                $(this).off("DOMSubtreeModified");
            }
        });
    });
}

function hideVariantNodesByClass(cl) {
    $(document).arrive(cl, function () {
        var name = $(this).find("a").text();
        if (name.startsWith("(") && name.endsWith(")")) {
            $(this).hide();
        }
    });
}

function showVariantNodesByClass(cl) {
    $(document).arrive(cl, function () {
        var name = $(this).find("a").text();
        if (name.startsWith("(") && name.endsWith(")")) {
            $(this).show();
        }
    });
}

function HideShowTreeNodes() {
    if (!unpublishedVariantsHidden) {

        $(unpublishedVariantsClass2).each(function () {
            $(this).hide();
        });

        hideVariantNodesByClass(unpublishedVariantsClass1);

        EnableHideIndicator();
        unpublishedVariantsHidden = true;

    } else {

        $(unpublishedVariantsClass2).each(function () {
            $(this).show();
        });

        showVariantNodesByClass(unpublishedVariantsClass1);

        DisableHideIndicator();
        unpublishedVariantsHidden = false;
    }
};
