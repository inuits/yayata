# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.21] - 2026-06-05

### Added
- Added filtered leave Types

## [1.0.20] - 2023-06-26

### Added
- Year selector in the leaves widget (Dashboard).
### Fixed
- Add using passed date in Leave widget (when creating a new leave request from Week view).
- Time of the leave request is not being reset after the request is submitted.
### Changed
- User avatar in the absences widget (Dashboard) does not contain leave type.

## [1.0.19] - 2023-06-24

### Added
- Saving event as ICS file in the events widget (Dashboard).
### Fixed
- Dashboard and all widgets are now responsive.
- User avatar in the absences and birthday widgets (Dashboard) is now clickable and redirects to the user's profile.
- Leave widget (Dashboard) behaviour is now smoother when creating one-day/multi-day leave. 
### Changed
- Calendar and Quotes widgets are now merged to one widget.
- User avatar in the birthday widget (Dashboard) displays absolute birthday date instead of relative.

## [1.0.18] - 2023-06-21

### Added
- In the Dashboard - Absences widget - there are new icons or full/half day absences, and another icons to distinguish sickness and holidays.
- In the Dashboard - Request leave widget - there are new icons for easier booking of half/full day.
- Yayata remembers last selected contract for standby/oncall.
- Oncall icon 'zzZ' is shown in monthly overview.
- Hot-reload for yayata running in docker. 
### Fixed
- Year/week numbers in the URL should show correct numbers in the first weeks of the new year.
- FAQ poits to Inuits GitHub fork not to Kalman Olah's Github repo's.
- When zoom in the page there is a slider for menu.
### Changed
- Username filter moved to the left in the availability view.

## [1.0.17] - 2022-07-27

### Added
- Add planned leave overview of planned/approved hours.

## [1.0.16] - 2022-07-26

### Changed
- Restrict maximum amount of requested leave hours per day to the contract hours.

## [1.0.15] - 2022-07-22

### Fixed
- This Week page now does have available Log performance, Log whereabout and Request leave buttons for months with no timesheet yet.

## [1.0.14] - 2022-06-28

### Fixed
- Blank screen bug fixed (at least some reasons are fixed).

### Added
- Added general error message to the login page.
- New logout button added to left sidebar so the user is able to do a re-login by its own using UI.


## [1.0.13] - 2020-02-10

### Changed

- Sidebar calendar max date changed to 2030. Note to future me: I'm sorry
- Improved importing site - added invalid redmine imports

## [1.0.12] - 2019-07-24

### Changed

- Availability view is reworked to show more information

## [1.0.11] - 2019-07-09

### Added

- You can use `;` to search in Availability for more than one user
- Updated boostrap-vue to rc25 - this should prevent modal from closing onMouseUp event

## [1.0.10] - 2019-02-04

### Fixed

- When submitting your timesheet from the month view, the status now
  correctly updates from 'active' to 'pending'.

## [1.0.9] - 2019-01-24

### Changed

- Buttons for printing timesheet PDFs now actually look like buttons.

- The display state of the timesheet details on the month view is now saved
  as a user preference. This means that whether or not the details are shown
  will be remembered across tabs/page reloads/etc.

- Restructured the availability view.

## [1.0.8] - 2019-01-23

### Changed

- Instead of identicons, use avatars based on user initials as defaults for
  avatars if gravatars are not found.

- The absence and birthday widgets now show lists of avatars instead of lists
  of plain names.

## [1.0.7] - 2019-01-22

### Added

- On the month view, pending leave is now shown.

- Hours worked on the month view can now be expanded to show a breakdown of
  hours worked per contract, leave taken, etc.

## [1.0.6] - 2019-01-16

### Fixed

- When your access token expires and multiple requests are pending, multiple
  refreshes will no longer be attempted. Previously this would cause all but
  the first refresh to fail, causing you to be logged out.

## [1.0.5] - 2018-11-09

### Changed

- When bulk adding a contract is no longer be selected by default. This should
  prevent people from accidentally adding 20-ish performances to the wrong
  contract.

## [1.0.4] - 2018-10-23

### Changed

- When importing performance linked to a contract without explicitly defined
  performance types, we now fall back to allowing all performance types
  instead of not allowing the import.

## [1.0.3] - 2018-10-11

### Added

- Integration tests added utilizing the power of docker and cypress.

## [1.0.2] - 2018-10-08

### Removed

- All references to V1 API removed, leaving only V2 API code. Guesstimates
  indicate that over half of vuex code was removed.

## [1.0.1] - 2018-10-03

### Fixed

- Fix being unable to create performance due to broken date formatting.

### Changed

- Render "changelog" contents by ourselves, instead of allowing the GitHub API
  to do so.

## [1.0.0] - 2018-10-03

### Added

- Start keeping a changelog.
- "Changelog" section.
- 925r API v2 support.

### Changed

- Users will now be prompted to view recent changes after the service worker
  has been updated.
- The application will now check for new versions every hour, instead of on
  navigation events.

### Removed

- 925r API v1 support.