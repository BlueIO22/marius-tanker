import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Frontpage',
  name: 'frontpage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blocks',
      type: 'array',
      title: 'Blocks',
      of: [
        {
          type: 'reference',
          to: [{type: 'grid'}, {type: 'author'}, {type: 'tag'}, {type: 'post'}],
        },
      ],
    }),
  ],
})
