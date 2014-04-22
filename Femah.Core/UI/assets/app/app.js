Femah.FeatureSwitchTypeView = Backbone.View.extend({
    el: "#featureswitchtypes",

    template: _.template($('#template-featureswitchtypes').html()),

    render: function () {
        _.each(this.model.models, function (featureSwitchType) {
            var featureSwitchTypeTemplate = this.template(featureSwitchType.toJSON());
            $(this.el).append(featureSwitchTypeTemplate);
        }, this);

        return this;
    }
});

var featureSwitchTypes = new Femah.FeatureSwitchTypes();
var featureSwitchTypesView = new Femah.FeatureSwitchTypeView({ model: featureSwitchTypes });
featureSwitchTypes.fetch();
featureSwitchTypes.bind('reset', function () {
    featureSwitchTypesView.render();
});