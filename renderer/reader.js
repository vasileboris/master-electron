let readItClose = document.createElement('div');
readItClose.innerText = 'Done'

readItClose.style.position = 'fixed';
readItClose.style.bottom = '15px';
readItClose.style.right = '15px';
readItClose.style.padding = '5px 10px';
readItClose.style.fontSize = '20px';
readItClose.style.fontWeight = 'bold';
readItClose.style.background = 'dodgerblue';
readItClose.style.color = 'white';
readItClose.style.borderRadius = '5px';
readItClose.style.cursor = 'default';
readItClose.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)';
readItClose.style.zIndex = '9999';

readItClose.onclick = e => {
    window.opener.postMessage({
        action: 'delete-reader-item',
        itemIndex: {{index}}
    }, '*')
}

document.getElementsByTagName('body')[0].append(readItClose);