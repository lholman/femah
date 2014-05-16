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
    
    template: _.template($("#featureswitches-list-template").html()),

    events: {
        //"submit form": "updateFeatureSwitch",
        "click .toggle": "toggleFeatureState",
    },

    initialize: function(options) {
        this.options = options || {};
        this.listenTo(this.model, "change", this.render);
//        this.listenTo(this.model, "add", this.render);
//        this.listenTo(this.model, "reset", this.render);
//        this.listenTo(this.model, "all", this.render);

    },
    render: function () {
        this.featureTypesList = this.options.featureTypesList;

        //this.template = $("#featureswitches-list-template").html();
        //var compiled = _.template(this.template);
        this.$el.html(this.template({ model: this.model.toJSON(), featureTypes: this.featureTypesList }));
        return this;
    },
    updateFeatureSwitch: function(event) {
        event.preventDefault();
        var enabledStatus = $("#featureswitch-status-enabled").val();
        this.model.set({ IsEnabled: enabledStatus });
        this.model.save();
        return this;
    },
    toggleFeatureState: function () {
        this.model.set({ IsEnabled: !this.model.IsEnabled });
        this.model.save();
        return this;
    }
});

Femah.FeatureSwitchesView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.collection, "reset", this.render);
        this.listenTo(this.collection, "change", this.render);
        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);
        this.listenTo(this.collection, 'reset', this.addAll);
    },
    //tagName: "table",
    el: $("#featureswitches-app"),

    addOne: function (todo) {
        var view = new TodoView({ model: todo });
        this.$("#todo-list").append(view.render().el);
    },

    addAll: function () {
        this.collection.each(this.addOne, this);
    },

    render: function () {
        var els = [];
        var featureTypesList = Femah.featureSwitchTypes.toJSON();
        this.collection.each(function (item) {
            var itemView = new Femah.FeatureSwitchView({ model: item, featureTypesList: featureTypesList });
            els.push(itemView.render().el);
        });

        //return this;
        //$(this.el).html(els);
       // $("#featureswitches-list").html(this.el);
    }
});