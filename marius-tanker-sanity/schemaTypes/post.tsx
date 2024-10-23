import {faNewspaper} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Innlegg',
  type: 'document',
  icon: () => <FontAwesomeIcon icon={faNewspaper} />,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (v) => v.required(),
    }),
    defineField({
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200, // will be ignored if slugify is set
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      validation: (v) => v.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: {type: 'author'},
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Bilde',
      description: 'Hovedbilde for innlegget',
      validation: (v) => v.required(),
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
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
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      author: 'author.name',
    },
    prepare: ({title, subtitle, author}) => {
      return {
        title: title,
        subtitle: subtitle + ' av ' + author,
      }
    },
  },
})
