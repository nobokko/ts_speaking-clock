// https://github.com/vixie/cron/blob/master/config.h

import { _PATH_SENDMAIL } from "./pathnames.h";

/*
 * these are site-dependent
 */
export const DEBUGGING = 1;

/*
* choose one of these mailer commands.  some use
* /bin/mail for speed; it makes biff bark but doesn't
* do aliasing.  sendmail does do aliasing but is
* a hog for short messages.  aliasing is not needed
* if you make use of the MAILTO= feature in crontabs.
* (hint: MAILTO= was added for this reason).
*/
export const MAILFMT = "%s -FCronDaemon -odi -oem -oi -t";

/* -Fx	 = Set full-name of sender
			 * -odi	 = Option Deliverymode Interactive
			 * -oem	 = Option Errors Mailedtosender
			 * -oi   = Ignore "." alone on a line
			 * -t    = Get recipient from headers
			 */
export const MAILARG = _PATH_SENDMAIL;
