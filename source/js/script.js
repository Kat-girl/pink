var navigation = document.querySelector('.navigation');
var navToggle = document.querySelector('.navigation__toggle');
var headerMain = document.querySelector('.page-header__main');

navigation.classList.remove('navigation--nojs');

navToggle.addEventListener('click', function() {
  if (navigation.classList.contains('navigation--closed')) {
    navigation.classList.remove('navigation--closed');
    navigation.classList.add('navigation--opened');
    headerMain.classList.add('page-header__main--nav-opened');
  }
  else {
    navigation.classList.add('navigation--closed');
    navigation.classList.remove('navigation--opened');
    headerMain.classList.remove('page-header__main--nav-opened');
  }
});
