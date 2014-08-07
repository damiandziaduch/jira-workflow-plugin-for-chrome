var Hax = {

    fixVersion: null,
    isAuto: false,
    
    init: function () {
        Hax.fixVersion = $.trim($('#fixfor-val').text());
        Hax.project    = $('meta[name=ajs-issue-key]').attr('content').substr(0, $('meta[name=ajs-issue-key]').attr('content').indexOf('-')).toLowerCase();
        Hax.isAuto     = Hax.project === 'autoten';
    },

    handleBtnClick: function () {
        if (!Hax.isClickedButtonHandled(this)) {
            return;
        }
        Hax.handleResolveBtnClick();
    },

    isClickedButtonHandled : function (button) {
        switch ($('span', button).text()) {
            case 'Code Review':
            case 'Resolve to QA':
            case 'Peer Review':
                return true;
            default:
                return false;
        }
    },

    handleResolveBtnClick: function () {
        var interval = window.setInterval(function () {
            if (!$('.jira-dialog').is(':visible')) return;
            window.clearInterval(interval);
            Hax.handleDialogOpen();
        }, 250);
    },

    handleDialogOpen: function () {
        Hax.fillDescription();
        Hax.fillDepartment();
    },

    fillDescription: function () {
        $('.jira-dialog-open .comment-input textarea').val(function () {
            if ('None' === Hax.fixVersion) {
                return Hax.getDetailedDescription();
            } else {
                return Hax.getMergedDescrption();
            }
        });
    },

    getDetailedDescription: function () {
        return ['Description', 'Replicate / Demonstrate', 'Affected Area(s)', 'Screenshot(s)', 'Settings / SQL', 'Branch'].map(function (name) {
            return '*' + name + '*:\n' + ('Branch' === name ? Hax.getBranchName() : 'N/A\n\n');
        }).join('');
    },

    getBranchName: function () {
        var id = $('meta[name=ajs-issue-key]').attr('content');
        if (Hax.isAuto || 'ial' === Hax.project) {
            return id;
        }
        if ('aljuli' === Hax.project) {
            return 'branches/' + id;
        }
        return 'branches/' + Hax.getBranchDir() + '/trunk-jira-' + id.toLowerCase();
    },

    getBranchDir: function () {
        switch ($.trim($('#type-val').text().toLowerCase())) {
            case 'software defect':
                return 'defects';
            default:
                return 'features';
        }
    },

    getMergedDescrption: function () {
        return 'Merged to ' + Hax.getMergedTo() + '.';
    },

    getMergedTo: function () {
        if (Hax.isAuto) return 'develop';
        return 'version ' + Hax.fixVersion.replace(/(\d+\.\d+)+(\.\d+)?/, '$1');
    },

    fillDepartment: function () {
        $('#' + $('.jira-dialog-open label:contains("Department")').attr('for')).val(Hax.getDepartment);
    },

    getDepartment: function () {
        switch (Hax.project) {
            case 'nmgboem': case 'net':
                return 'QA - OEM';
            case 'std': case 'sun':
                return 'QA - Sales';
            case 'lbthree': case 'lbtwo': case 'telephony': case 'chatmg': case 'ncm':
                return 'QA - Comms Suite';
            default:
                return 'QA';
        }
    }
};

Hax.init();
$(document).on('click', '.issueaction-workflow-transition', Hax.handleBtnClick);