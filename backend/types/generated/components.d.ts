import type { Schema, Struct } from '@strapi/strapi';

export interface LinkitemLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_linkitem_link_items';
  info: {
    displayName: 'LinkItem';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface NavsectionNavSection extends Struct.ComponentSchema {
  collectionName: 'components_navsection_nav_sections';
  info: {
    displayName: 'NavSection';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    leftItems: Schema.Attribute.Component<'linkitem.link-item', true>;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    rightItems: Schema.Attribute.Component<'linkitem.link-item', true>;
  };
}

export interface NutritionNutrition extends Struct.ComponentSchema {
  collectionName: 'components_nutrition_nutritions';
  info: {
    displayName: 'nutrition';
    icon: 'seed';
  };
  attributes: {
    carbs: Schema.Attribute.Decimal;
    energy: Schema.Attribute.Integer;
    fat: Schema.Attribute.Decimal;
    notes: Schema.Attribute.Text;
    protein: Schema.Attribute.Decimal;
    saturated: Schema.Attribute.Decimal;
    servingPerPacket: Schema.Attribute.Integer;
    servingSize: Schema.Attribute.String;
    sodiums: Schema.Attribute.Decimal;
    sugars: Schema.Attribute.Decimal;
  };
}

export interface SociallinksSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_sociallinks_social_links';
  info: {
    displayName: 'Social Links';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'linkitem.link-item': LinkitemLinkItem;
      'navsection.nav-section': NavsectionNavSection;
      'nutrition.nutrition': NutritionNutrition;
      'sociallinks.social-links': SociallinksSocialLinks;
    }
  }
}
