import { connect } from 'react-redux'
import en from '../locales/en.i18n'
import zh from '../locales/zh.i18n'

const langList = { en, zh }

const withi18n = WrapComponent => {
  return connect(({ lang }) => ({ i18n: langList[lang] }))(WrapComponent)
}

export {
  langList, withi18n
}

