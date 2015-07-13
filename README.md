# Ui-date-picker

[![Build Status](https://travis-ci.org/firefly-ui/ui-date-picker.svg)](https://travis-ci.org/firefly-ui/ui-date-picker)

## Usage
This ember addon provides you with a selection of calendars to use.

These components can be used on their own or they can be used grouped together in a dropdown.

### Date Calendar
The ```ui-date-calendar``` component displays a formatted calendar with days of the month and allows a user to select one date.

**Example:**
```
{{ui-date-calendar
  title="Show Date"
  date=date
  minDate=minDate
  maxDate=maxDate
  on-change="updateDate"
}}
```

### Date Range Calendar
The ```ui-date-range-calendar``` component displays a formatted calendar with days of the month and allows a user to select either one date or a range of dates.

**Example:**
```
{{ui-date-range-calendar
  title="Show Date"
  startDate=startDate
  endDate=endDate
  minDate=minDate
  maxDate=maxDate
  on-change="updateDates"
}}
```

### Date Input
The ```ui-date-input``` component displays an input with the date.

**Example:**
```
{{ui-date-input on-change="updateDate" date=date placeholder="MM/DD/YYYY"}}
```

#### Date Input (Range) Option
The ```ui-date-input``` also can be used to display a range of dates in an input.

**Example:**
```
{{ui-date-input on-change="updateStartDate" date=startDate placeholder="MM/DD/YYYY"}}
-
{{ui-date-input on-change="updateEndDate" date=endDate placeholder="MM/DD/YYYY"}}
```

#### Date Select
The ```ui-date-select``` component displays a button that allows your user to select a date. Such as today, yesterday, or tomorrow.

**Example:**
```

{{ui-date-select
  title="Today"
  date=startDate
  selectedDate=todayDate
  action="updateDate"
}}

{{ui-date-select
  title="Yesterday"
  date=startDate
  selectedDate=yesterdayDate
  action="updateDate"
}}
```

#### Date Range Select
The ```ui-date-range-select``` component displays a button that allows your user to select a range of dates. Such as, the current month, or current week.

**Example:**
```
{{ui-date-range-select
  title="This Week"
  startDate=startDate
  endDate=endDate
  rangeStart=startOfWeek
  rangeEnd=endOfWeek
  action="updateDates"
}}

{{ui-date-range-select
  title="This Month"
  startDate=startDate
  endDate=endDate
  rangeStart=startOfMonth
  rangeEnd=endOfMonth
  action="updateDates"
}}

{{ui-date-range-select
  title="This Year"
  startDate=startDate
  endDate=endDate
  rangeStart=startOfYear
  rangeEnd=endOfYear
  action="updateDates"
}}

```

#### Styles

The styles for the calendar components can be modified for your application. The header, previous and next month, individual days, and more can be modified. 

Individual days can be styled using `.ff-date-calendar-day` which has options such as is-not-in-month, disabled, and selected.
Example:
```
  .ff-date-calendar-day {
    .&disabled {
      cursor: not-allowed;
    }
  }
```

See the demo application for more examples.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
