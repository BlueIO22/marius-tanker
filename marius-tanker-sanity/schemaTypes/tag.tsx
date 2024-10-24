import {faTag} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {defineField, defineType} from 'sanity'

export default defineType({
  type: 'document',
  name: 'tag',
  title: 'Tag',
  icon: () => <FontAwesomeIcon icon={faTag} />,
  description: 'Tags for å kunne søke på innlegg',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
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
      name: 'parent',
      title: 'Hoved tag',
      type: 'reference',
      to: {type: 'tag'},
    }),
  ],
})
