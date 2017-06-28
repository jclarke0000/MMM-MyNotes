# MMM-MyNotes

This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

This module displays your most recent notes from your Google GMail account.

## Installation

1. Navigate to your MagicMirro `modules` directory and execute<br>
`https://github.com/jclarke0000/MMM-MyNotes.git`
2. Enter the new `MMM-MyNotes` directory and execute `npm install`.

## Authorization

It is very important that you follow these steps carefully.  Before this module will work, you need to grant authorization for this module to access your GMail account.

1. Go to https://console.developers.google.com/flows/enableapi?apiid=gmail&pli=1 and create a new project.  Don't use an existing one, as we need to make some specific configurations that may conflict with your existing project.
2. Once you've created yopur project, click *Continue*, then *Go to credentials*.
3. On the *Add credentials to your project* page, click the *Cancel* button.
4. At the top of the page, select the *OAuth consent screen* tab. 
5. Enter the Product name `Magic Mirror Notes`.
6. Select your GMail address.  This is just the account with which you are associating your developer account.  It doesn't need to be the same as the GMail account for which you want to display notes.
7. Click the *Save* button.
8. Select the *Credentials* tab, click the *Create credentials* button and select *OAuth client ID*.
9. Select the application type *Other*
10. Enter the name `Magic Mirror Notes`. It is important that this matches exactly.
11. Click the *Create* button.
12. Click *OK* to dismiss the resulting dialog.
13. Click the file download icon button to the right of the client ID.
14. Rename this file `client_secret.json` and copy it to your MMM-MyNotes directory.
15. In the *MMM-MyNotes* directory execute `node authorize.js`.
16. Follow the instructions to authorize the GMail account for which you want to display notes on your mirror.

If everything went well, you shoudl see `MMM-MyNotes is authorized` in your console.  No you can configure your module as below:

## Configuration

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>maxNotes</code></td>
      <td>The maximum number of your most recent notes to display<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>10</code></td>
    </tr>
    <tr>
      <td><code>pollFrequency</code></td>
      <td>How frequently to poll your GMail account for changes in notes.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>300000</code> (5 minutes)</td>
    </tr>
    <tr>
      <td><code>showDatePosted</code></td>
      <td>Whether to show the date when the note was created<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code> (5 minutes)</td>
    </tr>
    <tr>
      <td><code>dateFormat</code></td>
      <td>the date format to use for the posted date.  Uses Moment.js supported date formats (https://momentjs.com/docs/#/displaying/)<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>MMM D</code> (e.g.: Jul 1)</td>
    </tr>
  </tbody>
</table>

## Sample Config

```
{
  module: 'MMM-MyNotes',
  header: "Bulletin Board",
  position: 'top_right',
  classes: 'default everyone',
  config: {
    maxNotes: 5,
    pollFrequency: 600000,
    showDatePosted: true,
    dateFormat: 'D-MMM-YYYY'
  }
},

```