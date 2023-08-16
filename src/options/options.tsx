/* global document */

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { sendMessage } from 'utils/sendMessages';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import '../utils/style.scss';

const Index = () => {
    const [blacklist, setBlacklist] = useState([]);

    const remove = async (site: string) => {
        const res = await sendMessage({ type: 'remove_from_blacklist', data: site });
        if (res) {
            // @ts-ignore
            blacklist.splice(blacklist.indexOf(site), 1);
            setBlacklist([...blacklist]);
        }
    };

    useEffect(() => {
        // @ts-ignore
        sendMessage({ type: 'get_blacklist' }).then((res) => {
            setBlacklist(res.data);
        });
    }, []);

    return (
        <ListGroup as={'ol'} numbered>
            {blacklist.map((item, i) => (
                <ListGroupItem
                    as={'li'}
                    key={i}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span>{item}</span>
                    <Button onClick={() => remove(item)}>Unblock</Button>
                </ListGroupItem>
            ))}
        </ListGroup>
    );
};

const root = ReactDOM.createRoot(document.getElementById('display-container')!);
root.render(<Index />);
