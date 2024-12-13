import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'grid',
  title: 'Grid',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'columns',
      type: 'number',
      title: 'Antall kolonner',
      initialValue: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rows',
      type: 'number',
      title: 'Antall rader',
      initialValue: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'posts',
      type: 'array',
      title: 'Artikler',
      of: [
        {
          type: 'reference',
          to: [{type: 'post'}],
        },
      ],
    }),
  ],
})
