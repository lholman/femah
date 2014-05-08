//Femah.FeatureSwitchTypeView = Backbone.View.extend({
//    tagName: "li",
//    render: function() {
//        var template = $("#featureswitchtypes-list-template").html();
//        var compiled = _.template(template, this.model.toJSON());
//        $(this.el).html(compiled);
//        return this;
//    }
//});
//
//Femah.FeatureSwitchTypesView = Backbone.View.extend({
//    initialize: function () {
//        this.collection.bind("reset", this.render, this);
//        this.collection.bind("add", this.render, this);
//        this.collection.bind("remove", this.render, this);
// 
//    },
//    tagName: "ul",
//    render: function () {
//        var els = [];
//        this.collection.each(function (item) {
//            var itemView = new Femah.FeatureSwitchTypeView({ model: item });
//            els.push(itemView.render().el);
//        });
//        //return this;
//        $(this.el).html(els);
//        $("#featureswitchtypes-list").html(this.el);
//    }
//});

function shortenFeatureTypeName(featureType) {
    return featureType.replace("Femah.Core.FeatureSwitchTypes.", "").replace(", Femah.Core, Version=0.1.0.0, Culture=neutral, PublicKeyToken=null", "");
};

Femah.FeatureSwitchType = Backbone.Model.extend({
});

Femah.FeatureSwitchTypeCollection = Backbone.Collection.extend({
    model: Femah.FeatureSwitchType,
    url: '/femah.axd/api/featureswitchtypes',
    comparator: function (collection) {
        return (collection.get('Name'));
    }
});

Femah.FeatureSwitch = Backbone.Model.extend({
    url: function() {
        return "/femah.axd/api/featureswitches/" + this.id;
    },
    idAttribute: "Name"
});

Femah.FeatureSwitchCollection = Backbone.Collection.extend({
    model: Femah.FeatureSwitch,
    url: '/femah.axd/api/featureswitches',
    comparator: function (collection) {
        return (collection.get('Name'));
    }
});

Femah.FeatureSwitchView = Backbone.View.extend({
    tagName: "tr",
    initialize: function(options) {
        this.options = options || {};
        //_.bindAll(this, this.render);
        //this.model.on("change", this.render, this);
        this.listenTo(this.model, "change", this.render);
//        this.listenTo(this.model, "add", this.render);
//        this.listenTo(this.model, "reset", this.render);
//        this.listenTo(this.model, "all", this.render);

    },
    events: {
        "submit form": "updateFeatureSwitch"
    },
    updateFeatureSwitch: function(event) {
        event.preventDefault();
        var enabledStatus = $("#featureswitch-status-enabled").val();
        this.model.set({ IsEnabled: enabledStatus });
        this.model.save();
        //this.render();
        return this;
    },
    render: function () {
        this.featureTypesList = this.options.featureTypesList;

        this.template = $("#featureswitches-list-template").html();
        var compiled = _.template(this.template);
        this.$el.html(compiled({ model: this.model.toJSON(), featureTypes: this.featureTypesList }));
        return this;
    }
});

Femah.FeatureSwitchesView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.collection, "reset", this.render);
        this.listenTo(this.collection, "change", this.render);
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);
    },
    tagName: "table",
    render: function () {
        var els = [];
        var featureTypesList = Femah.featureSwitchTypes.toJSON();
        this.collection.each(function (item) {
            var itemView = new Femah.FeatureSwitchView({ model: item, featureTypesList: featureTypesList });
            els.push(itemView.render().el);
        });

        //return this;
        $(this.el).html(els);
        $("#featureswitches-list").html(this.el);
    }
});