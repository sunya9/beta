import { Factory } from 'rosie'
import { Client } from '~/entity/client'
export const client = new Factory<Client.Source>().sequence('id').attrs({
  name: 'test',
  link: 'https://example.com/client',
})
