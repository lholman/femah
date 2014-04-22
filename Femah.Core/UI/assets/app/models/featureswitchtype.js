var Femah = {};

Femah.FeatureSwitchType = Backbone.Model.extend();

Femah.FeatureSwitchTypes = Backbone.Collection.extend({
    model: Femah.FeatureSwitchType,
    url: 'http://r9-fv2z5-vm1/femah.axd/api/featureswitchtypes'
});

