import type { Schema, Struct } from '@strapi/strapi';

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
      'sociallinks.social-links': SociallinksSocialLinks;
    }
  }
}
