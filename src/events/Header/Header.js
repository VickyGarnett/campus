import React from 'react'
import FocusLock from 'react-focus-lock'
import clsx from 'clsx'
import { FaSearch } from 'react-icons/fa'

import Link from 'components/Link/Link'
import Logo from 'components/Logo/Logo'
import Portal from 'components/Portal/Portal'
import SearchBar from 'components/SearchBar/SearchBar'

import Button from 'elements/Button/Button'

import { getBasePath } from 'utils/get-base-path'

import styles from './Header.module.css'

const NavLink = (props) => (
  <Link
    activeClassName={styles.activeNavLink}
    className={styles.navLink}
    {...props}
  />
)

const Nav = () => {
  const [searchBarVisible, setSearchBarVisible] = React.useState(false)
  const searchBarRef = React.createRef()

  React.useEffect(() => {
    if (searchBarVisible && searchBarRef.current) {
      searchBarRef.current.focus()
    }
  }, [searchBarVisible])

  return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <ul className={styles.navItems}>
          <li className={styles.navLogoItem}>
            <NavLink to="/">
              <Logo critical text />
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to={getBasePath('posts')}>Resources</NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to={getBasePath('tags')}>Topics</NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to={getBasePath('categories')}>Sources</NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/course-registry">Course Registry</NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.navRight}>
        <ul className={styles.navItems}>
          <li className={styles.searchBarContainer}>
            {searchBarVisible ? (
              <SearchBar ref={searchBarRef} className={styles.searchBar} />
            ) : null}
          </li>
          <li className={styles.navItem}>
            <button
              onClick={() =>
                setSearchBarVisible((searchBarVisible) => !searchBarVisible)
              }
              className={styles.searchBarToggle}
            >
              <FaSearch />
            </button>
          </li>
          <li className={styles.navItemButton}>
            <Button
              as={Link}
              className={styles.button}
              to="https://www.dariah.eu/helpdesk/"
            >
              Contact
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

const MobileNavLink = (props) => (
  <Link
    activeClassName={styles.mobileActiveNavLink}
    className={styles.mobileNavLink}
    {...props}
  />
)

const Hamburger = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect y="9" width="20" height="2"></rect>
    <rect y="3" width="20" height="2"></rect>
    <rect y="15" width="20" height="2"></rect>
  </svg>
)

const MobileNav = () => {
  const [isVisible, setIsVisible] = React.useState(false)
  const openButtonRef = React.createRef()

  const setOverlayVisible = () => {
    const documentWidth = document.documentElement.clientWidth
    const windowWidth = window.innerWidth
    const scrollBarWidth = windowWidth - documentWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = scrollBarWidth + 'px'
    setIsVisible(true)
  }

  const setOverlayInvisible = () => {
    document.body.style.overflow = 'unset'
    document.body.style.paddingRight = 0
    setIsVisible(false)
  }

  React.useEffect(() => {
    if (!isVisible && openButtonRef.current) {
      openButtonRef.current.focus()
    }
  }, [isVisible])

  React.useEffect(() => {
    return () => setOverlayInvisible()
  }, [])

  return (
    <div className={styles.mobileNav}>
      <div className={styles.mobileNavBar}>
        <button
          ref={openButtonRef}
          aria-label="Open menu"
          className={styles.mobileNavToggle}
          onClick={() => setOverlayVisible()}
        >
          <Hamburger />
        </button>
        <NavLink to="/">
          <Logo critical text />
        </NavLink>
        {/* we actually don't have search in nav bar on mobile
          think about whether we whould add it later in the panel */}
        <div className={styles.mobileNavSearch} />
      </div>
      <Portal>
        <FocusLock disabled={!isVisible}>
          <div
            className={styles.mobileNavOverlay}
            style={{
              pointerEvents: isVisible ? 'all' : 'none',
              opacity: isVisible ? 1 : 0,
            }}
            onClick={() => setOverlayInvisible()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setOverlayInvisible()
              }
            }}
          >
            <div
              className={styles.mobileNavPanel}
              style={{
                transform: isVisible ? undefined : 'translateX(100%)',
              }}
            >
              <button
                aria-label="Close menu"
                className={styles.mobileNavCloseButton}
                onClick={() => setOverlayInvisible()}
              >
                &times;
              </button>
              <nav>
                <ul className={styles.mobileNavItems}>
                  <li className={styles.mobileNavItem}>
                    <MobileNavLink to="/">Home</MobileNavLink>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <MobileNavLink to={getBasePath('posts')}>
                      Resources
                    </MobileNavLink>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <MobileNavLink to={getBasePath('tags')}>
                      Topics
                    </MobileNavLink>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <MobileNavLink to={getBasePath('categories')}>
                      Sources
                    </MobileNavLink>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <MobileNavLink to="/course-registry">
                      Course Registry
                    </MobileNavLink>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <MobileNavLink to="/about">About</MobileNavLink>
                  </li>
                </ul>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    as={Link}
                    className={styles.button}
                    to="https://www.dariah.eu/helpdesk/"
                  >
                    Contact
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </FocusLock>
      </Portal>
    </div>
  )
}

const Header = ({ className }) => {
  // determine if page has scrolled
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(!scrolled)
      }
    }

    document.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      // clean up the event handler when the component unmounts
      document.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  return (
    <header className={clsx(styles.header, className)} data-active={scrolled}>
      <Nav />
      <MobileNav />
    </header>
  )
}

export default Header
