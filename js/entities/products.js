import moment from 'moment';
import productsEditionTemplate from './productsEditionTemplate.html';

var fromNow = v => moment(v).fromNow();

export default function (nga, admin) {

    var products = admin.getEntity('products')
        .label('Posters');
    products.listView()
        .title('All Posters')
        .fields([
            nga.field('i', 'template')
                .isDetailLink(true)
                .label('')
                .template('<img src="{{ entry.values.thumbnail }}" class="poster_mini_thumbnail" />'),
            nga.field('reference').isDetailLink(true),
            nga.field('price', 'amount')
                .cssClasses('number'),
            nga.field('width', 'float')
                .format('0.00')
                .cssClasses('number'),
            nga.field('height', 'float')
                .format('0.00')
                .cssClasses('number'),
            nga.field('category_id', 'reference')
                .label('Category')
                .targetEntity(admin.getEntity('categories'))
                .targetField(nga.field('name')),
            nga.field('stock', 'number')
                .cssClasses('number'),
        ])
        .filters([
            nga.field('q', 'template')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('category_id', 'reference')
                .label('Category')
                .targetEntity(admin.getEntity('categories'))
                .targetField(nga.field('name')),
            nga.field('stock', 'template')
                .label('Out of stock')
                .defaultValue(0)
        ])
        .listActions(['edit', 'delete']);
    products.creationView()
        .title('Create new Poster')
        .fields([
            nga.field('reference')
                .validation({required: true })
                .cssClasses('col-sm-4'),
            nga.field('price', 'amount')
                .validation({required: true })
                .cssClasses('col-sm-4'),
            nga.field('width', 'float')
                .validation({required: true })
                .cssClasses('col-sm-2'),
            nga.field('height', 'float')
                .validation({required: true })
                .cssClasses('col-sm-2'),
            nga.field('category_id', 'reference')
                .label('Category')
                .targetEntity(admin.getEntity('categories'))
                .targetField(nga.field('name'))
                .validation({required: true })
                .cssClasses('col-sm-4'),
            nga.field('stock', 'number')
                .validation({required: true, min: 2 })
                .cssClasses('col-sm-2'),
            nga.field('thumbnail')
                .validation({required: true })
                .cssClasses('col-sm-4'),
            nga.field('image')
                .validation({required: true })
                .cssClasses('col-sm-4'),
        ]);
    products.editionView()
        .template(productsEditionTemplate)
        .fields(
            products.creationView().fields(),
            nga.field('reviews', 'referenced_list')
                    .targetEntity(admin.getEntity('reviews'))
                    .targetReferenceField('product_id')
                    .permanentFilters({ status: 'accepted' })
                    .targetFields([
                        nga.field('date')
                            .label('Posted')
                            .map(fromNow)
                            .isDetailLink(true),
                        nga.field('rating', 'template')
                            .template('<star-rating stars="{{ entry.values.rating }}"></star-rating>'),
                        nga.field('comment')
                            .map(function truncate(value) {
                                if (!value) {
                                    return '';
                                }
                                return value.length > 50 ? value.substr(0, 50) + '...' : value;
                            })
                    ])
                    .sortField('date')
                    .sortDir('DESC')
        );

    return products;
}
