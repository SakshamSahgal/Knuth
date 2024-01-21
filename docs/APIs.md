
# ALL APIs interacting with the Server

| Serial No | Endpoints | Request Method | Normal<br>Access | Admin Access | Coordinator Access | Middlewares Used |
| :--: | :--: | :--: | :--: | :--: | ---- | ---- |
| 1 | [/ping](APIs/ping.md) | `GET` | `YES` | `YES` | `YES` | N/A |
| 2 | [/](APIs/root.md) | `GET` | `YES` | `YES` | `YES` | redirectIfLoggedIn |
| 3 | [/pod/:page?](APIs/podPage.md) | `GET` | `YES` | `YES` | `YES` | isLoggedIn,  updateLastActivity |
| 4 | [/postPOD](APIs/postPOD.md) | `POST` | `NO` | `YES` | `YES` | upload.none(), multerErrorHandling, isLoggedIn, isCoordinator, updateLastActivity, checkParameters |
| 5 | [/deletePOD/:id](APIs/deletePODId.md) | `DELETE` | `NO` | `YES` | `YES` | isLoggedIn, isCoordinator, updateLastActivity |
| 6 | [/home](APIs/home.md) | `GET` | `YES` | `YES` | `YES` | isLoggedIn, updateLastActivity |
| 7 | [/logout](APIs/logout.md) | `GET` | `YES` | `YES` | `YES` | isLoggedIn |
| 8 | [/profile/:email](APIs/profileEmail.md) | `GET` | `YES` | `YES` | `YES`<br> | isLoggedIn, updateLastActivity |
| 9 | [/feedback](APIs/feedback.md) | `GET` | `YES` | `YES` | `YES` | isLoggedIn, updateLastActivity |
| 10 | [/postFeedback](APIs/postFeedback.md) | `POST` | `YES` | `YES` | `YES` | upload.none(), multerErrorHandling, isLoggedIn, updateLastActivity, feedbackContentCheck |
| 11 | [/events/:page?](APIs/eventsPage.md) | `GET` | `YES` | `YES` | `YES` | isLoggedIn, updateLastActivity |
| 12 | [/postEvent](APIs/postEvent.md) | `POST` | `NO` | `YES` | `YES` | isLoggedIn, isCoordinator, upload.array, multerErrorHandling, TypeCheck, FieldLengthCheck, updateLastActivity |
| 13 | [/DeleteEvent/:id](APIs/deleteEventId.md) | `DELETE` | `NO` | `YES` | `YES` | isLoggedIn, isCoordinator, updateLastActivity |
| 14 | [/coordinators](APIs/coordinators.md) | `GET` | `YES` | `YES` | `YES` | isLoggedIn,updateLastActivity |
| 15 | [/ConnectWithUs](APIs/connectWithUs.md) | `GET` | `YES` | `YES` | `YES` | isLoggedIn,updateLastActivity |
| 16 | [/announcements/:page?](APIs/announcementsPage.md) | `GET` | `YES` | `YES` | `YES` | isLoggedIn, updateLastActivity |
| 17 | [/PostAnnouncements](APIs/postAnnouncements.md) | `POST` | `NO` | `YES` | `YES` | isLoggedIn, isCoordinator, upload.array, multerErrorHandling, TypeCheck, FieldLengthCheck, updateLastActivity |
| 18 | [/DeleteAnnouncement/:id](APIs/deleteAnnouncementId.md) | `DELETE` | `NO` | `YES` | `YES` | isLoggedIn, isCoordinator, updateLastActivity |
| 19 | [/SubscribeAnnouncement](APIs/subscribeAnnouncement.md) | `POST` | `YES` | `YES` | `YES` | isLoggedIn, updateLastActivity |
| 20 | [/UnsubscribeAnnouncement](APIs/unsubscribeAnnouncement.md) | `DELETE` | `YES` | `YES` | `YES` | isLoggedIn, updateLastActivity |
| 21 | [/admin/users](APIs/adminUsers.md) | `GET` | `NO` | `YES` | `NO` | isLoggedIn, isAdmin |
| 22 | [/admin/subscribers](APIs/adminSubscribers.md) | `GET` | `NO` | `YES` | `NO` | isLoggedIn, isAdmin |
| 23 | [/admin/approvals](APIs/adminApprovals.md) | `GET` | `NO` | `YES` | `NO` | isLoggedIn, isAdmin |
| 24 | [/approveMail](APIs/approveMail.md) | `POST` | `NO` | `YES` | `NO` | isLoggedIn, isAdmin |
| 25 | [/rejectMail](APIs/rejectMail.md) | `POST` | `NO` | `YES` | `NO` | isLoggedIn, isAdmin |
