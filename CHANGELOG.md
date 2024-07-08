* e18eed4 Added in Private modes for pages and novels. Clean up modal headers, clean up button classnames
* c8616f6 Bug fix with Chatinput, bug fix with Floating Text Editor, Updates to review.md
* 97ce1b3 Added the ability to update and delete messages within 3 min window
* 59a1754 Added a placeholder notification for chats based on socket events. Also fixed a bug with chat on mobile not being viewable against nav menu
* 7864c8b Updated Readme. Fixed Scroll bug due to chats and comments on mobile. Updated Review. Increase page character count to 8500
* eca3696 Built out Chat mechanic for pages. Added Update Icon, added back navigation to all routes that have a param. Still require chat delete and update and update readme docs about the new Chats table
* 00180b9 Added fixes to bash script
* 02fa611 Cleaned up review log
* b697206 bash update test 4
* d439792 bash update test 3
* d0c2ebf bash update test 2
* fb42583 bash update test
* 07da544 bash update attempt 15
* 3452ec0 bash update attempt 14
* 0e63bc2 bash update attempt 13
* 48e65fb bash update attempt 12
* a5691a2 bash update attempt 11
* 972fb90 bash update attempt 10
* f74766a bash update attempt 9
* 765c86c bash update attempt 8
* 7312277 bash update attempt 7
* 2871d65 bash update attempt 6
* 13918af bash update attempt 5
* 0c52861 bash update
* 767cdd0 Test for again
* cddde25 Test for new bash script
* c69175c Updated Changelog and Review Page. Renamed ChatIcon to CommentIcon and added a chatIcon for future feature
* 2da445d Added Changelog to be under about page. Added Tutorial System to Pages. Add an alert to Pages when the owner logs on and off
* a2f85e3 changed from sign in to log in
* 84ba6cf moved change log route reference to about page
* 4c0fbbc reference vercel build change log to fix bug
* 18c1e98 moved changelog to public
* ee999db try locate change log file
* 48b9984 added copy of changelog to public
* fce2287 fixed issue with path in prod
* d30f109 added Change log public route
* 03419f5 Added a dated changelog.md file
* 77c1d93 (tag: 0.01) fixed overflow on navmenu for mobile
* 77092b8 made sure that update on profile always reset state
* e9eda5e fix to button sizing on pageid
* 9c192b8 fixed mobile big with participants on novelid page
* 1d63008 fixed mobile big with participants on novelid page
* 3e226eb added some more spinners
* 8d8f877 added some more spinners
* fcdadc0 added some more spinners
* 0deb8fa added loading stats for users and dash
* a3014b5 cleaned up button sizes
* c408229 updated the create icon
* 9358dc7 added icons to all buttons and cleaned up all CSS styles
* f625eb7 fixed issue with close icon on mobile
* 9c32ee4 removed references to email, updated settings menu, fixed bug with text length on connect
* 64dbde4 cleaned up css for speech to text, buttons, icons, dialogs
* 7d9437c reduced the debounce lag and fixed toast on mobile
* b6fff1b updated debounce timer to make up for prod lag
* 2634236 removed ellipsis-2
* 80221bf built out all socket events
* 03d7673 updated online users section
* 89e8733 added collab button to novelid page
* 2aaccbc fixes database keys and avatar image
* 0cfcb34 made fixes to avatar input
* c96b026 small style updates to about page
* 2e7c8fd fixed strange overflow issue on pages
* cc082fe removed supabase folder
* 061003c updated readme
* a7041b5 fixed novel delete end point and added delete profile pic end point trigger
* ad2a410 updates to novel delete end point for pages
* ff8ad18 updates to novel delete end point for pages
* 1484a39 updated delete end point
* 9f8505a fixed issue with delete page route
* 45b0078 appended the delete method api
* 07ce5c3 added delete method for pages
* bbfe8dc fixed novel api
* a7a75cf checker for novel api
* a9b0831 update for api.novel
* c046a33 small updates to api.novel
* 3b6e305 added some console logs to liveblocks
* e8a390a removed some env files from client and fixed novel api
* 69a7d29 fixed record reference
* 9d226ea added the novel api end point
* e16e183 added in novel webhook
* 90a64ca fixed overflow issue and removed api profile route used for testing
* 8bf2771 started webhooks infastructure
* a5b0dcb added disconnect options, moved some icons, fixed publish, added sync state
* f4105fd fixed publish error
* 260cba4 additional cleanup to about page
* a64ef1c fixes to word break on about page
* 73dfd75 fixed about overflow
* 965a6b3 style fixes to about page
* a520626 small logo clean up on about page
* d2048d1 added lexical and liveblocks to tech stack in about
* 3d52ecb fix to source link on about page
* 6a72b86 updated env and small about updates
* 76cb925 move lexical collab to live blocks, fixed time, added ability to associate color with highlighting and saves to doc
* fbc56b8 clean up of basicProfile type
* 1d42fea fixed avatar bug when user does not have an avatar
* 79f8802 small changes to about page
* cd825a6 updated readme table setup
* 06dbba9 added api for adding, deleting a page. Turning on and off collab
* a5adf47 removed a console.dir
* d163530 fixed some navigation issues
* ebf2acf database update and added pages
* cc15efe added disconnect options for comments, added buttons and titles, updates to Provider
* 0a198cd fixed novel draft index sub heading
* f4c7d6a built out co-operative novel writting
* 3d414e0 fixed bug with reset new details
* d956d3e fixed bug when making new novel
* a635425 more mobile fixes
* f91cafb fixed mobile padding issue
* 0ffadf4 fixed issue with mobile settings page not being able to scroll
* be74eb2 added room event
* 5054b2f added username to dash and fixed spacing. Fixed bug where user participate didnt route to novel
* fde6ac8 added users route to dash. Added supabase presence and broadcast features
* dc68b49 fixed participant api call and fixed the trigger
* 7db68b2 moved description to lexical and fixed up database issues with participation
* 8f22dd5 updated database api calls to trigger updates from Auth User to cascade and update library and drafts. Added delete user end point. Update supabase database queries and triggers. Updated readme
* 8c6ec6b fixed addComment position on mobile and comment panel. Fixed some scroll issues with CommentInput
* 82cbd40 added userColor as highlight and fixed highlight in draft novel page
* 919f11d added comment section and moved more styles to tailwind including mobile responsive properties
* 802bbe6 moved Editor styles to tailwind apply variables. Removed Common CSS file
* 6fe09b5 moved a lot of multiple API calls to singles that use triggers inside supabase. Cleaned up code. Updated Readme to reflect Supabase Database Tables and Storage
* 82cbd40 added userColor as highlight and fixed highlight in draft novel page
* 919f11d added comment section and moved more styles to tailwind including mobile responsive properties
* 802bbe6 moved Editor styles to tailwind apply variables. Removed Common CSS file
* 6fe09b5 moved a lot of multiple API calls to singles that use triggers inside supabase. Cleaned up code. Updated Readme to reflect Supabase Database Tables and Storage
* 65b0ef9 added ability to delete novels
* c0ba9a1 fixed dash nav responsiveness and reset upon pressing new novel button
* 86528c5 fixed textarea commponent size
* 16ff159 fixed image cropper mobile large images
* 1289c30 fixed dash mobile responsiveness
* 06c41df fixed a create account bug
* ed020a8 added a method to edit descriptions and add limits
* 42b40a5 changed dash to grid instead of table
* 5ab0aae small css fixes, typescript additions, moving auth sign out
* ee6074c converted css to tailwind
* ea01003 changes all non tailwind css to use apply. Fixes parstel emerald spelling reference error
* 70cea44 fixed color picker emerald spelling
* c595541 fixed up about tooltips
* 179160e replaced message noval og:image
* 4eacb02 removed console log another one
* 5216d1a removed console log
* 541297c fixed bug with starting a new novel
* 3cab18c fixed logout button styles
* 8d47028 fixed lexical styles
* 0c9a40d removed console log and made toolbar sticky
* 34a15e8 fixed draft page mobile responsiveness
* 2bda4fd built out lexical and added og:image
* 5dbafd0 dash mobile nav bar on bottom
* 86ade80 made dashboard more responsive
* 6d72404 fixed dash fetch and creating novel api calls
* c7aedfc fixed issue with creating a profile
* 9b55668 fixed image select
* 3d056fb fixed mobile header colors
* 5659235 clean up local strings, added isTransition or isPending to links
* ac6bc56 removed console.log
* a6abcc1 added console.log
* f6c0fe7 fixed initial render
* e60e5df removed load page
* 911b0a5 added dracoLoader
* 86b562c fixed issue with glb files for vite
* 70cc6c2 console log for model path
* e011821 used differnet modal import
* 56695f9 moved glb to public
* 154df34 added some consoles and throw error
* de933ca added some consoles
* e71fc52 fixed sitemap url issue
* 00256fb attempt to fix three js import issue
* 60187fb fixed import issue
* 8b8cef4 added vercel plugin
* 919282c added vercel plugin
* 1590cd5 fixed asset import for three js background
* 1c3852b fixed pathing issue
* ab97863 fixed threejs background path
* 9bf164f fixed import issue
* 4db484e cleaned up component folder and types
* 256cdf7 folder clean up and moved towards a MVC folder structure. Plus added bun logo
* 0356e2e folder clean up and moved towards a MVC folder structure
* 2884b79 cleaned up ThreeJsBackground naming and folder structure
* 0424363 cleaup
* 30e5969 small bug fixes to DashNovelId and login Api call
* 3933251 cleaned up service folder and made the preview dialog of a novel
* 1b16c26 fixed image cropper crop bug
* 6e7d7e8 fixed image cropper to actually save data
* 544b647 image cropper, dash api calls, library api calls, settings, style fixes etc
* e364168 added credits page, tooltips, new svgs, password input see password
* 0aa6b58 moved to full server api calls
* 75dad0a fixed eslint, fixed Gsap animations
* bddcbf2 added gsap and three js background
* 47fb9b1 three.js background
* 27f8b29 started
* 1190c01 started
* 51c3a77 started
* dcc68df Initial commit from create-remixCommit
