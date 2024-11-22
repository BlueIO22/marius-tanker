import {faInfoCircle, faNewspaper} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {defineArrayMember, defineField, defineType} from 'sanity'

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
      name: 'excerpt',
      type: 'text',
      title: 'Utdrag',
      description: 'Kort utdrag av innlegget',
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
      name: 'imageCreditLine',
      type: 'string',
      description:
        'Bildekreditering er veldig viktig, hvis bildet er valgt fra unsplash så kommer dette automatisk',
      title: 'Bildekredittering',
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [
              defineArrayMember({
                type: 'object',
                name: 'explanation',
                title: 'Forklaring',
                icon: <FontAwesomeIcon icon={faInfoCircle} />,
                fields: [
                  defineField({
                    name: 'title',
                    title: 'Tittel',
                    type: 'string',
                  }),
                  defineField({
                    name: 'content',
                    title: 'Innhold',
                    type: 'text',
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'isWrittenByAI',
      title: 'Er dette innholdet laget av KI?',
      validation: (rule) =>
        rule.custom((_, context: any) => {
          if (
            context.document.content !== undefined &&
            context.document.content.length > 0 &&
            context.document.isWrittenByAI === undefined
          ) {
            return 'Siden du har innhold må du oppgi om det er brukt KI eller ikke'
          }
          return true
        }),
      hidden: (context: any) => {
        return context.document.content === undefined || context.document.content.length === 0
      },
      type: 'boolean',
      description: 'Hvis dette innholdet er laget av KI må du opplyse om dette',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      options: {
        layout: 'tags',
      },
      of: [
        {
          type: 'reference',
          to: {
            type: 'tag',
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
