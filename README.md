# Currency Converter App

This simple web application uses the [currencybeacon API](https://currencybeacon.com/register) together with a simple React-based UI to allow users to convert between any 2 currencies of their choice.

## Running the app

After cloning the branch, run the following 2 commands:

```
npm install
npm run dev
```

to serve the app on localhost at port 5173.

## Design and development decisions

In building this project quickly, I have inevitably had to concentrate on some aspects more than others. In particular, my 2 guiding principles were:

- test coverage, of all the important user flows, is of vital importance. For this purpose I have used Jest and React Testing Library.
- I have focused on simplicity, usability, and in particular, accessibility, of the user interface in preference to any fancy visual effects or things "looking pretty".

On that second point in particular, I have decided to use the native HTML `<select>` element for the currency selects, rather than any fancier components - either custom-built or third-party - to do the same job. The native element was the quickest way I could build something that I knew would work and would also be usable by all, despite its shortcomings (most notably, inability to style consistently across all browser and operating systems). For a "real" production application, depending on more detailed requirements (which I was not given for this assignment), it might well be necessary to look into using a custom component in a third-party library - or perhaps even building something custom.

In all these cases, my decision to make the Select its own component, even though at present it is a very simple wrapper for the HTML `<select>`, should make it relatively straightforward to change the implementation in future.

I am also aware that the overall styling is no more than functional, and it would definitely need work to look better for a real application. But I make no pretence to being a UI or UX designer, and building a fancier, nicer-looking version would be dependent on being given clear specifications.

Finally, due to the lack of time available, even taking the above points into account, some other things weren't done as well or as fully as I would have ideally liked. Namely:
- The top-level `App.tsx` component is much more "busy" in terms of logic than I would ideally like. I have left it as it is because I feel there at least isn't any obvious repetition in the code that could easily be refactored away, nor can any of the remaining logic easily be hidden away inside a child component, as what is left either affects all components (notably the currencies selected), or is necessarily "global" information (like any errors returned by the APIs). If future maintenance showed a refactor was clearly needed then at least it should be possible to do so in confidence given that there are robust tests in place which do not depend too sensitively on implementation details.
- I would have liked to put in place some more robust error handling. I have not had time to study in detail what sorts of errors the API might throw (or under what circumstances it would give a non-200 response code) - nor does this seem well documented. I have opted for now to simply let the user know something went wrong, via a prominent red error message that is very generic, and log further details in the console so that a developer can easily find precisely what went wrong if needed.
- despite my stressing above the accessibility was a key concern of mine, I cannot be 100% sure it is completely accessible to screenreader users as I have not had time to properly test the app while using a screenreader. This would be a priority for me in a real situation. While I am fairly confident that the core is accessible, I am not sure precisely how the various error states would be communicated, and I would not be surprised if there were important improvements to make here.