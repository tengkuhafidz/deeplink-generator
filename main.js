
const app = new Vue({
    el: '#app',
    data: {
        isMouseoverCopy: false,
        currentTab: 'gcal',
        whatsapp: {
            message: "",
            mobileNumber: null,
            generatedUrl: ""
        },
        telegram: {
            message: "",
            url: "",
            recipientUsername: "",
            generatedUrl: ""
        },
        twitter: {
            message: "",
            url: "",
            hashtags: "",
            generatedUrl: ""
        },
        gmaps: {
            startingAddress: "",
            destinationAddress: "",
            includeDirections: true,
            generatedUrl: ""
        },
        gcal: {
            tilte: "",
            description: "",
            locationAddress: "",
            startDateTime: new Date(),
            endDateTime: null
        },
        date: new Date()
    },
    mounted() {
        var tomorrow = new Date();

        // add a day
        tomorrow.setDate(tomorrow.getDate() + 1);
        const calendar = bulmaCalendar.attach(this.$refs.calendarTrigger, {
            startDate: this.date,
            endDate: tomorrow,
            isRange: true
        })[0]
        calendar.on('date:selected', e => {
            console.log("APAPAPAPAPAP")
            (this.date = e.start || null)
        })
    },
    methods: {
        generateWhatsappUrl: function() {
            const { message, mobileNumber } = this.whatsapp;
            const formattedMessasage = this.replaceEmptySpaces(message);
            this.whatsapp.generatedUrl = `https://api.whatsapp.com/send?phone=${mobileNumber}&text=${formattedMessasage}`;
            this.copyGeneratedUrl(this.whatsapp.generatedUrl);
        },
        generateTelegramUrl: function() {
            const { message, url, recipientUsername } = this.telegram;
            if (message || url){
                const formattedMessasage = this.replaceEmptySpaces(message);
                const formattedUrl = this.formatUrl(url);
                this.telegram.generatedUrl = `https://telegram.me/share/url?url=${formattedUrl}&text=${formattedMessasage}`
            } else {
                this.telegram.generatedUrl = `https://telegram.me/YourUsername?text=${recipientUsername}`;
            }
            this.copyGeneratedUrl(this.telegram.generatedUrl);
        },
        generateTwitterUrl: function() {
            const { message, url, hashtags } = this.twitter;
            const formattedMessasage = this.replaceEmptySpaces(message);
            const formattedUrl = this.formatUrl(url);
            this.twitter.generatedUrl = `https://twitter.com/share?text=${formattedMessasage}&url=${formattedUrl}&hashtags=${hashtags}`;
            this.copyGeneratedUrl(this.twitter.generatedUrl);
        },
        generateGmapsUrl: function() {
            const { startingAddress, destinationAddress, includeDirections } = this.gmaps;
            const formattedStartingAddress = this.replaceEmptySpaces(startingAddress);
            const formattedDestinationAddress = this.replaceEmptySpaces(destinationAddress);
            
            if(includeDirections) {
                this.gmaps.generatedUrl = startingAddress ? 
                `https://www.google.com/maps?saddr=${formattedStartingAddress}&daddr=${formattedDestinationAddress}`:
                `https://www.google.com/maps?daddr=${formattedDestinationAddress}`;
            } else {
                this.gmaps.generatedUrl = `https://www.google.com/maps?q=${formattedDestinationAddress}`
            }
            
            this.copyGeneratedUrl(this.gmaps.generatedUrl);
        },
        copyGeneratedUrl: function(generatedUrl) {
            this.copyToClipboard(generatedUrl);
            this.showSnackbar(generatedUrl);
        },
        copyToClipboard: function(generatedUrl) {
            // Create textarea element as document.execCommand('copy') only works with text area. (I think)
            var el = document.createElement('textarea');
            el.value = generatedUrl;
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = {position: 'absolute', left: '-9999px'};
            document.body.appendChild(el);
            // Select generatedUrl inside element
            el.select();
            // Copy generatedUrl to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
        },
        showSnackbar: function(generatedUrl) {
            Snackbar.show({
                text: 'Copied link to clipboard!',
                pos: 'bottom-center',
                actionText: 'Open Link',
                actionTextColor: 'hsl(217, 71%, 53%)',
                onActionClick: () => window.open(generatedUrl, '_blank')
            });
        },
        formatUrl: function(url) {
            return `https://${url}`;
        },
        replaceEmptySpaces(str) {
            return str.split(' ').join('%20');
        },
        updateGcalDates: function() {
            console.log("test")
        }
    },
    computed: {
        hasTelegramUsername: function() {
            return !!this.telegram.recipientUsername;
        },
        hasTelegramMessageOrUrl: function() {
            return !!this.telegram.message || !!this.telegram.message;
        },
        gcalStartDateTime: function() {
            if (this.gcal.startDateTime) {
                return this.gcal.startDateTime.toLocaleDateString()
            }
        }
    }
  });