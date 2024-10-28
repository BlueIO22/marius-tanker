import {faUserPen} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Forfatter',
  type: 'document',
  icon: () => <FontAwesomeIcon icon={faUserPen} />,
  fields: [
    defineField({
      name: 'name',
      title: 'Navn',
      description: 'Navn på forfatter',
      validation: (v) => v.required(),
      type: 'string',
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200, // will be ignored if slugify is set
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      type: 'image',
      name: 'image',
      title: 'Bilde',
      description: 'Bilde av forfatter',
    }),
    defineField({
      name: 'age',
      title: 'Alder',
      description: 'Alder på forfatteren',
      type: 'number',
    }),
    defineField({
      name: 'occupation',
      title: 'Yrke',
      description: 'Yrke eller virke',
      type: 'string',
    }),
    defineField({
      name: 'description',
      description: 'Beskrivelse av forfatter',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
          },
        },
      ],
    }),
  ],
})
