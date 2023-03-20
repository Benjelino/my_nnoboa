import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/auth/auth-service/authentication.service';
import { ISession } from '../common-service/models/common-model.service';

import { Utils } from "../utility-services/utils";
//import { ISession } from '../../services/common-service/models/common-model.service';
//import { AuthenticationService } from '../../services/profile-service/authentication.service';


/**
 * This interceptor automatically adds the token header needed by our backend API if such token is present
 * in the current state of the application.
 */
@Injectable({
    providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private auth: AuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let session: ISession = this.auth.getSessionToken();
        let sessionToken = null;
        if (null != session.token) {
            sessionToken = session.token;
        }
        let xCsrfToken = null;
        if (null != session.xCsrfToken ) {
            xCsrfToken = session.xCsrfToken;
        }

        let moquiVisitorId = null;
        if (null != session.moquiVisitorId) {
            moquiVisitorId = session.moquiVisitorId;
        }
        let visitorCookie = null;
        if (null != session.visitorCookie) {
            visitorCookie = session.visitorCookie;
        }

        let credentials = {
            withCredentials: true
        };

        if (Utils.stringNotEmpty(sessionToken) || Utils.stringNotEmpty(xCsrfToken)
            || Utils.stringNotEmpty(moquiVisitorId)
            || Utils.stringNotEmpty(visitorCookie)) {
            let newHeaders = req.headers;

            // If we have a sessionToken, we append it to our new headers
            // newHeaders = newHeaders.append('moquiSessionToken', sessionToken);
            if (Utils.stringNotEmpty(sessionToken)) {
                newHeaders = newHeaders.append('moquiSessionToken', sessionToken);
            }

            if (Utils.stringNotEmpty(xCsrfToken)) {
                // If we have a xCsrfToken, we append it to our new headers
                newHeaders = newHeaders.append('X-CSRF-Token', xCsrfToken);
            }

            if (Utils.stringNotEmpty(moquiVisitorId)) {
                // If we have a moquiVisitorId, we append it to our new headers
                newHeaders = newHeaders.append('moquiVisitorId', moquiVisitorId);
            }
            if (Utils.stringNotEmpty(visitorCookie)) {
                // If we have a visitorCookie, we append it to our new headers
                newHeaders = newHeaders.append('visitorCookie', visitorCookie);
            }

            credentials['headers'] = newHeaders;
        }
        console.log('TokenInterceptorService::intercept() credentials: ' + JSON.stringify(credentials));
        
        let authReq = req.clone(credentials);
        console.log('TokenInterceptorService::intercept() authReq: ' + JSON.stringify(authReq));

        return next.handle(authReq).pipe(
            map(resp => {
                console.log('TokenInterceptorService::intercept() (typeof resp): ' + (typeof resp));
                console.log('TokenInterceptorService::intercept() resp: ' + JSON.stringify(resp));
                if (resp instanceof HttpResponse) {
                    let respHdr = resp.headers;
                    console.log('TokenInterceptorService::intercept() respHdr: ', respHdr);
                    console.log('TokenInterceptorService::intercept() header keys: ', resp['headers'].keys());
                    console.log('TokenInterceptorService::intercept() resp[body]: ' + JSON.stringify(resp['body']));
                    const moquisessiontoken = respHdr.get('moquisessiontoken');
                    if (Utils.stringNotEmpty(moquisessiontoken)) {
                        this.auth.setSessionToken(moquisessiontoken);
                    }

                    const xCsrfToken = respHdr.get('X-CSRF-Token');
                    if (Utils.stringNotEmpty(xCsrfToken)) {
                        this.auth.setXCsrfToken(xCsrfToken);
                    }

                    const moquiVisitorId = respHdr.get('moquiVisitorId');
                    if (Utils.stringNotEmpty(moquiVisitorId)) {
                        this.auth.setMoquiVisitorId(moquiVisitorId);
                    }
                    const visitorCookie = respHdr.get('visitorCookie');
                    if (Utils.stringNotEmpty(visitorCookie)) {
                        this.auth.setVisitorCookie(visitorCookie);
                    }
                }
                return resp;
            })
        );
    }

}