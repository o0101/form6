# form6

Small client-side extension for HTML5 forms that adds the useful feature of named fieldsets for nested data.

## Rationale

This is how I felt `<fieldset>` should always have worked. As it stands, the `name` attribute on the tag has no effect on form submission values.

## usage

```html

<form>
  <fieldset name=data>
    <legend>User App Data</legend>
    <input name=username placeholder=username>
    <fieldset name=fullname>
      <legend>Full name</legend>
      <input name=first placeholder=first>
      <input name=last placeholder=last>
    </fieldset>
    <fieldset name=state>
      <legend>State</legend>
      <input name=id placeholder=id>
      <fieldset name=history>
        <legend>History</legend>
        <fieldset name=0>
          <input type=url name=url placeholder=url>
          <input type=text name=title placeholder=title>
        </fieldset>
        <fieldset name=1>
          <input type=url name=url placeholder=url>
          <input type=text name=title placeholder=title>
        </fieldset>
      </fieldset>
      <fieldset name=session>
        <legend>Session</legend>
        <input name=uuid placeholder=uuid>
        <input name=username placeholder=username>
      </fieldset>
    </fieldset>
  </fieldset>
</form>
<script type=module>
  import {enhanceForm} from './index.js';

  enhanceForm(document.querySelector('form'));
</script>
```

Output:

```html
<form>
  <fieldset name="data">
    <legend>User App Data</legend>
    <input name="data[username]" placeholder="username">
    <fieldset name="fullname">
      <legend>Full name</legend>
      <input name="data[fullname][first]" placeholder="first">
      <input name="data[fullname][last]" placeholder="last">
    </fieldset>
    <fieldset name="state">
      <legend>State</legend>
      <input name="data[state][id]" placeholder="id">
      <fieldset name="history">
        <legend>History</legend>
        <fieldset name="0">
          <input type="url" name="data[state][history][0][url]" placeholder="url">
          <input type="text" name="data[state][history][0][title]" placeholder="title">
        </fieldset>
        <fieldset name="1">
          <input type="url" name="data[state][history][1][url]" placeholder="url">
          <input type="text" name="data[state][history][1][title]" placeholder="title">
        </fieldset>
      </fieldset>
      <fieldset name="session">
        <legend>Session</legend>
        <input name="data[state][session][uuid]" placeholder="uuid">
        <input name="data[state][session][username]" placeholder="username">
      </fieldset>
    </fieldset>
  </fieldset>
</form>
```

## What I like about this

I like how this permits the structuring of HTML for data entry in a format similar to the format the data is expected. Suggesting a closer model between the interface and the data model, and I also like how it uses HTML as a data carrying language (reminiscient of XML).




