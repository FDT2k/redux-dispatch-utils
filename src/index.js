/*
Author: F.Karsegard


resolve a promise using redux-thunk


PayloadResolver is a function resolving your payload,
Reject & ResolveAction creator are the local sync action to dispatch after the promise resolves or not



makePromiseDispatcher = FN<PayloadResolver> => FN <PayloadResolver> => <ActionCreator> => <ResolvedActionCreator> => (Promise, Object={}) => FN<Dispatcher>;



*/

import {identity,curry,compose,trace,prop,tryCatcher} from '@geekagency/composite-js'
import Promise from 'bluebird'

export const makePromiseDispatcher = curry((payloadResolver,errorPayloadResolver,RejectedActionCreator,ResolvedActionCreator,promise) =>{
  return  (dispatch,getState)=>{

    return tryCatcher(
       Promise.reject,
       identity,
       promise()
        .then ( compose(dispatch,ResolvedActionCreator,payloadResolver) )
        .catch( compose(Promise.reject,prop('payload'),dispatch,RejectedActionCreator,errorPayloadResolver) )
    )
  /*  try{

      return promise()
      .then(  compose(dispatch,ResolvedActionCreator,payloadResolver) )
      .catch( compose(Promise.reject,prop('payload'),dispatch,RejectedActionCreator,errorPayloadResolver) );

    }catch (error){ // always reject

      return Promise.reject(dispatch(RejectedActionCreator(error)))

    }*/
  }
})


export default makePromiseDispatcher(identity,identity);
