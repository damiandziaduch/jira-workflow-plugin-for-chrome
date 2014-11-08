(function (window, $) {
    'use strict';

    function Handler() {
        var key = $('meta[name=ajs-issue-key]').attr('content');
        this.project = key.substr(0, key.indexOf('-')).toLowerCase();
    }

    Handler.prototype.buttonHandler = function (button) {
        if (this.isButtonHandled(button)) {
            this.handleResolveButtonClick();
        }
    };

    Handler.prototype.isButtonHandled = function (button) {
        switch ($('span', button).text()) {
            case 'Code Review':
            case 'Resolve to QA':
            case 'Peer Review':
                return true;
            default:
                return false;
        }
    };

    Handler.prototype.handleResolveButtonClick = function () {
        var handler = this;
        var interval = window.setInterval(function () {
            if ($('.jira-dialog').is(':visible')) {
                window.clearInterval(interval);
                handler.handleDialogOpen();
            }
        }, 250);
    };

    Handler.prototype.handleDialogOpen = function () {
        this.fillDescription();
        this.fillDepartment();
    };

    Handler.prototype.fillDescription = function () {
        $('.jira-dialog-open .comment-input textarea').val(
            'None' === this.fixVersion ? this.getDetailedDescription() : this.getMergedDescrption()
        );
    };

    Handler.prototype.getDetailedDescription = function () {
        return [
            'Description',
            'Replicate / Demonstrate',
            'Affected Area(s)',
            'Screenshot(s)',
            'Settings / SQL'
        ].map(function (name) {
            return '*' + name + '*:\n' + 'N/A\n\n';
        }).join('');
    };

    Handler.prototype.getMergedDescrption = function () {
        return 'Merged.';
    };

    Handler.prototype.fillDepartment = function () {
        $('#' + $('.jira-dialog-open label:contains("Department")').attr('for')).val(this.getDepartment());
    };

    Handler.prototype.getDepartment = function () {
        switch (this.project) {
            case 'nmgboem': case 'net':
                return 'QA - OEM';
            case 'std': case 'sun':
                return 'QA - Sales';
            case 'lbthree': case 'lbtwo': case 'telephony': case 'chatmg': case 'ncm':
                return 'QA - Comms Suite';
            default:
                return 'QA';
        }
    };
    
    var handler = new Handler();
    
    $('body').on('click', '.issueaction-workflow-transition', function () {
        handler.buttonHandler(this);
    });
}(this, this.$));
