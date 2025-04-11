import { connect } from 'react-redux';
import store from '../redux/store/store';

export function Colors() {

  // let theme = store.getState().mainScreenInit ? store.getState().mainScreenInit.theme : 'light';
  let white = '#fff';
  let lightWhite = '#f7f7f8';
  let offWhite = 'rgb(255,255,255)';
  let black = 'rgb(0,0,0)';
  let blackTxt = '#000000';
  let lightWhiteTxt = '#FAFAFA';
  let textColor = "#121533";

  // if (theme == 'dark') {
  //   white = '#000';
  //   lightWhite = '#000';
  //   offWhite = "#000";
  //   black = "rgb(255,255,255)";
  //   blackTxt = "#fff";
  //   lightWhiteTxt = "#000";
  //   textColor = "#f5f5f5";
  // }

  return {
    light_white: lightWhite,
    custom_gray: 'rgb(182,182,182)',
    custom_purple: 'rgba(255, 229, 0, 1)',
    text_color: textColor,
    secondry_text_color: '#767787',
    link_color: '#626ABB',
    themeColor: "#626ABB",
    red: '#ff4848',
    success: '#00A36C',
    arrow_color: 'rgb(200,204,216)',
    custom_pink: 'rgb(247,74,105)',
    loader_bg: 'rgba(128,128,128,0.5)',
    white: white,
    offWhite: offWhite,
    newTag: 'rgba(103, 103, 105, 1)',
    black: black,
    light_gray: 'rgb(237,237,237)',
    placeholderTextColor: 'rgb(152,152,152)',
    backgroundColor: 'rgb(250,250,250)',
    languageBackgroundColor: 'rgba(255,255,255, 0.8)',
    lightYellowBackground: 'white',
    selectedGreen: 'rgba(0,118,22, 0.2)',
    green_text: '#0EC139',
    black_text: blackTxt,
    dark_gray_text: '#AAAAAA',
    light_gray_text: '#EEEEEE',
    light_white_text: lightWhiteTxt,
    tab_bar_color: 'rgb(250,250,250)',
    themeGreen: 'rgb(0,118,22)',
    yellow_text: 'rgb(250,200,0)',
    transparent: '#ffffff00',
    dark_grey: 'rgb(128,128,128)',
    line_color: 'rgb(210,210,210)',
    silverBackground: '#77e319',
    themeYellow: '#6dba2b',
    inactiveTabColor: '#ffffff70',
  }
};
