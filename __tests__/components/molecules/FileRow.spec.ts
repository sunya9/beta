import { mount } from '@vue/test-utils'
import FileRow from '~/components/molecules/FileRow.vue'
import { ModifiedFile } from '~/plugins/domain/entity/ModifiedFile'

function createFile(override: Partial<ModifiedFile>): Partial<ModifiedFile> {
  return {
    ...override,
  }
}
describe('FileRow', () => {
  test('render', () => {
    const wrapper = mount(FileRow, {
      propsData: {
        file: createFile({
          created_at: new Date('2020-08-09 16:00:00'),
          name: 'name',
        }),
      },
    })
    expect(wrapper.text()).toContain('August 9, 2020 4:00 PM')
    expect(wrapper.find('svg').attributes('data-icon')).toBe('file')
  })

  test('toggle select', async () => {
    const file = createFile({
      name: 'name',
    })
    const wrapper = mount(FileRow, {
      propsData: {
        file,
      },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:file')?.[0][0]).toStrictEqual({
      ...file,
      select: true,
    })
  })

  test('show audio icon', () => {
    const file: Partial<ModifiedFile> = createFile({
      name: 'name',
      audio_info: {
        bitrate: 1,
        duration: 1,
        duration_string: '0:01',
      },
    })
    const wrapper = mount(FileRow, {
      propsData: {
        file,
      },
    })
    expect(wrapper.find('svg').attributes('data-icon')).toBe('file-audio')
  })

  test('show video icon', () => {
    const file: Partial<ModifiedFile> = createFile({
      name: 'name',
      video_info: {
        bitrate: 1,
        duration: 1,
        duration_string: '0:01',
        height: 1,
        width: 1,
      },
    })
    const wrapper = mount(FileRow, {
      propsData: {
        file,
      },
    })
    expect(wrapper.find('svg').attributes('data-icon')).toBe('file-video')
  })

  test('show thumbnail when file is image', () => {
    const file: Partial<ModifiedFile> = createFile({
      name: 'name',
      image_info: {
        height: 1,
        width: 1,
      },
      link: 'https://example.com/image',
    })
    const wrapper = mount(FileRow, {
      propsData: {
        file,
      },
    })
    expect(wrapper.find('img').attributes('src')).toBe(
      'https://example.com/image'
    )
  })
})
