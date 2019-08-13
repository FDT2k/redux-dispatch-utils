/*ResolveActionCreator & RejectActionCreator are Action Creators which accept
  which looks like this

  const onresolve = (payload,meta={}){
    return {
    type: 'type',
    payload,
    ...meta
  }
  }

  payloadResolver is a function that returns the payload

  const payloadResolver = data=> data.whatever
*/

export const axiosPayloadResolver = data => data.data

export const makePromiseDispatch = payloadResolver =>  RejectActionCreator => ResolveActionCreator =>  (promise,meta={}) =>{
  return async (dispatch,getState)=>{
    try{
      let result = await promise;
      let payload = payloadResolver(result)
      dispatch(ResolveActionCreator(payload,meta));
      return Promise.resolve(payload)
    }catch (error){
      dispatch(RejectActionCreator(error,meta))
      return Promise.reject(error)
    }
  }
}

export const makeAxiosDispatch = makePromiseDispatch(axiosPayloadResolver)
